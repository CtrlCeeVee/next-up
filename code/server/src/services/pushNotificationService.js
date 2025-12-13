const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/**
 * Push Notification Service
 * Handles sending push notifications to user devices
 */
class PushNotificationService {
  
  /**
   * Send a push notification to a specific user
   * @param {string} userId - User's UUID
   * @param {object} payload - Notification payload
   * @returns {Promise<object>} Result with success/failure counts
   */
  async sendToUser(userId, payload) {
    try {
      // Get all active push subscriptions for this user
      const { data: subscriptions, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching subscriptions:', error);
        return { success: 0, failed: 0, error: error.message };
      }

      if (!subscriptions || subscriptions.length === 0) {
        console.log(`No active subscriptions for user ${userId}`);
        return { success: 0, failed: 0, message: 'No subscriptions' };
      }

      // Send to all user's devices
      const results = await Promise.allSettled(
        subscriptions.map(sub => this.sendToSubscription(sub, payload))
      );

      // Count successes and failures
      const success = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      console.log(`Sent notifications to user ${userId}: ${success} success, ${failed} failed`);

      return { success, failed };
    } catch (error) {
      console.error('Error in sendToUser:', error);
      return { success: 0, failed: 0, error: error.message };
    }
  }

  /**
   * Send notification to multiple users
   * @param {string[]} userIds - Array of user UUIDs
   * @param {object} payload - Notification payload
   * @returns {Promise<object>} Aggregated results
   */
  async sendToUsers(userIds, payload) {
    const results = await Promise.all(
      userIds.map(userId => this.sendToUser(userId, payload))
    );

    const totalSuccess = results.reduce((sum, r) => sum + (r.success || 0), 0);
    const totalFailed = results.reduce((sum, r) => sum + (r.failed || 0), 0);

    return { success: totalSuccess, failed: totalFailed };
  }

  /**
   * Send push notification to a single subscription
   * @param {object} subscription - Push subscription from database
   * @param {object} payload - Notification payload
   * @returns {Promise<void>}
   */
  async sendToSubscription(subscription, payload) {
    try {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh_key,
          auth: subscription.auth_key
        }
      };

      await webpush.sendNotification(
        pushSubscription,
        JSON.stringify(payload),
        {
          TTL: 60 * 60 * 24 // 24 hours
        }
      );

      // Update last_used_at timestamp
      await supabase
        .from('push_subscriptions')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', subscription.id);

    } catch (error) {
      console.error('Error sending to subscription:', error);

      // If subscription is invalid (410 Gone), deactivate it
      if (error.statusCode === 410 || error.statusCode === 404) {
        console.log(`Deactivating invalid subscription ${subscription.id}`);
        await supabase
          .from('push_subscriptions')
          .update({ is_active: false })
          .eq('id', subscription.id);
      }

      throw error;
    }
  }

  /**
   * Send "Match Assigned" notification
   * @param {object} match - Match data
   * @param {string[]} userIds - User IDs to notify
   */
  async notifyMatchAssigned(match, userIds) {
    const payload = {
      title: '🏓 Match Ready!',
      body: `Court ${match.court_number} vs ${match.opponent_names}`,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: `match-${match.id}`,
      requireInteraction: true,
      data: {
        type: 'match-assigned',
        matchId: match.id,
        leagueId: match.league_id,
        nightId: match.league_night_instance_id,
        url: `/league/${match.league_id}/night/${match.league_night_instance_id}?tab=matches`
      },
      actions: [
        { action: 'view', title: 'View Match' },
        { action: 'acknowledge', title: 'Got it!' }
      ]
    };

    return this.sendToUsers(userIds, payload);
  }

  /**
   * Send "Score Submitted - Needs Confirmation" notification
   * @param {object} match - Match data with pending score
   * @param {string[]} opponentUserIds - Opposing team user IDs
   */
  async notifyScoreSubmitted(match, opponentUserIds) {
    const payload = {
      title: '🎯 Score Submitted',
      body: `${match.submitter_names} submitted ${match.pending_team1_score}-${match.pending_team2_score}. Confirm?`,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: `score-${match.id}`,
      requireInteraction: true,
      data: {
        type: 'score-pending',
        matchId: match.id,
        leagueId: match.league_id,
        nightId: match.league_night_instance_id,
        url: `/league/${match.league_id}/night/${match.league_night_instance_id}?tab=matches`
      },
      actions: [
        { action: 'confirm-score', title: '✓ Confirm' },
        { action: 'dispute-score', title: '✗ Dispute' }
      ]
    };

    return this.sendToUsers(opponentUserIds, payload);
  }

  /**
   * Send "Partnership Request" notification
   * @param {object} request - Partnership request data
   * @param {string} targetUserId - User being requested
   */
  async notifyPartnershipRequest(request, targetUserId) {
    const payload = {
      title: '🤝 Partnership Request',
      body: `${request.requester_name} wants to partner with you`,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: `partner-${request.id}`,
      requireInteraction: true,
      data: {
        type: 'partnership-request',
        requestId: request.id,
        leagueId: request.league_id,
        nightId: request.league_night_instance_id,
        url: `/league/${request.league_id}/night/${request.league_night_instance_id}?tab=my-night`
      },
      actions: [
        { action: 'accept-partner', title: '✓ Accept' },
        { action: 'reject-partner', title: '✗ Decline' }
      ]
    };

    return this.sendToUser(targetUserId, payload);
  }
}

module.exports = new PushNotificationService();
