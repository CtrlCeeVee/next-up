const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Authentication middleware using Supabase
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided'
      });
    }

    const token = authHeader.substring(7);
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    
    req.user = { id: user.id };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

/**
 * GET /api/push/vapid-public-key
 * Get VAPID public key for client-side subscription
 * PUBLIC - No auth required (needed before subscription)
 */
router.get('/vapid-public-key', (req, res) => {
  res.json({
    success: true,
    publicKey: process.env.VAPID_PUBLIC_KEY
  });
});

// Apply authentication middleware to remaining routes
router.use(authenticateUser);

/**
 * POST /api/push/subscribe
 * Subscribe to push notifications
 * Body: { subscription: { endpoint, keys: { p256dh, auth } }, deviceInfo }
 */
router.post('/subscribe', async (req, res) => {
  try {
    const { subscription, deviceInfo } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({
        success: false,
        error: 'Invalid subscription object'
      });
    }

    // Check if subscription already exists
    const { data: existing } = await supabase
      .from('push_subscriptions')
      .select('id, is_active')
      .eq('user_id', userId)
      .eq('endpoint', subscription.endpoint)
      .single();

    if (existing) {
      // Reactivate if inactive
      if (!existing.is_active) {
        await supabase
          .from('push_subscriptions')
          .update({ 
            is_active: true,
            last_used_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      }

      return res.json({
        success: true,
        message: 'Subscription already exists',
        subscriptionId: existing.id
      });
    }

    // Create new subscription
    const { data, error } = await supabase
      .from('push_subscriptions')
      .insert({
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh_key: subscription.keys.p256dh,
        auth_key: subscription.keys.auth,
        device_info: deviceInfo || {},
        user_agent: req.headers['user-agent'] || ''
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create subscription'
      });
    }

    res.json({
      success: true,
      message: 'Subscribed to push notifications',
      subscriptionId: data.id
    });

  } catch (error) {
    console.error('Error in /push/subscribe:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/push/unsubscribe
 * Unsubscribe from push notifications
 * Body: { endpoint }
 */
router.post('/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    if (!endpoint) {
      return res.status(400).json({
        success: false,
        error: 'Endpoint required'
      });
    }

    // Deactivate subscription
    const { error } = await supabase
      .from('push_subscriptions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('endpoint', endpoint);

    if (error) {
      console.error('Error unsubscribing:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to unsubscribe'
      });
    }

    res.json({
      success: true,
      message: 'Unsubscribed from push notifications'
    });

  } catch (error) {
    console.error('Error in /push/unsubscribe:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/push/subscriptions
 * Get user's active subscriptions
 */
router.get('/subscriptions', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, device_info, user_agent, created_at, last_used_at')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch subscriptions'
      });
    }

    res.json({
      success: true,
      subscriptions: data
    });

  } catch (error) {
    console.error('Error in /push/subscriptions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/push/test
 * Send a test notification (for debugging)
 */
router.post('/test', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    const pushService = require('../services/pushNotificationService');
    
    const result = await pushService.sendToUser(userId, {
      title: '🧪 Test Notification',
      body: 'If you see this, push notifications are working!',
      icon: '/icon-192.png',
      tag: 'test',
      data: {
        type: 'test',
        url: '/'
      }
    });

    res.json({
      success: true,
      message: 'Test notification sent',
      result
    });

  } catch (error) {
    console.error('Error in /push/test:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
