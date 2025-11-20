# 🗄️ Database Setup & Migration Guide

## Quick Setup for New Environments

### 1. **Run Migrations in Order**
Execute these SQL files in Supabase SQL Editor in this exact order:

```bash
1. 001_add_matches_table.sql       # Core matches functionality
2. 002_fix_partnerships_function.sql # Fixes partnerships function
3. 003_fix_courts_function.sql     # Fixes courts function
```

### 2. **Verify Functions Work**
Test the database functions:

```sql
-- Test partnerships function
SELECT * FROM get_partnerships_with_game_counts(6);

-- Test courts function  
SELECT * FROM get_available_courts(6);
```

## Common Database Issues & Solutions

### **Issue: Column Reference Ambiguity**
```
Error: column reference "partnership_id" is ambiguous
```
**Solution**: Always qualify columns with table aliases
```sql
-- Bad
SELECT partnership_id FROM matches WHERE partnership_id = 1

-- Good  
SELECT m.partnership1_id FROM matches m WHERE m.partnership1_id = 1
```

### **Issue: Type Mismatch**
```
Error: Returned type bigint does not match expected type integer
```
**Solution**: Cast COUNT() results to INTEGER
```sql
-- Bad
COUNT(*) as games_count

-- Good
COUNT(*)::INTEGER as games_count
```

### **Issue: Function Permissions**
```
Error: permission denied for function
```
**Solution**: Grant proper permissions
```sql
GRANT EXECUTE ON FUNCTION function_name(params) TO anon, authenticated;
```

## Database Function Architecture

### **get_partnerships_with_game_counts()**
- **Purpose**: Priority queue for match assignment
- **Logic**: Sorts partnerships by games played tonight (fewest first)
- **Returns**: Partnership details + game counts + skill averages
- **Used by**: `/create-matches` endpoint

### **get_available_courts()**
- **Purpose**: Court availability for match assignment
- **Logic**: Returns unused court indices from court_labels array
- **Returns**: Available court numbers (1-based indices)
- **Used by**: `/create-matches` endpoint

## Testing Database Functions

### **Test Partnerships Function**
```sql
-- Should return partnerships sorted by games played
SELECT 
    partnership_id,
    player1_name,
    player2_name,
    games_played_tonight
FROM get_partnerships_with_game_counts(6)
ORDER BY games_played_tonight ASC;
```

### **Test Courts Function**
```sql
-- Should return available court numbers
SELECT court_number 
FROM get_available_courts(6);
```

## Match Assignment Flow

1. **Get Partnerships**: `get_partnerships_with_game_counts()` 
   - Returns partnerships sorted by games played (priority queue)
   - Includes skill levels for future balancing

2. **Get Available Courts**: `get_available_courts()`
   - Returns court indices based on league configuration
   - Excludes courts with active matches

3. **Create Matches**: Backend logic pairs partnerships and assigns courts
   - Takes 2 partnerships per available court
   - Inserts match records with court assignments
   - Returns queue information when courts are full

4. **Submit Scores**: Players submit validated scores
   - Enforces pickleball rules (first to 15, win by 2)
   - Automatically updates player statistics
   - Frees up courts for next round

5. **Statistics Update**: Automatic calculation of player performance
   - Games played, won, lost
   - Total points and average points per game
   - Persistent tracking across league nights

6. **Frontend Display**: Shows matches with player names and court labels
   - Uses court indices to lookup actual court names
   - Displays match status and scoring interfaces
   - Shows queue status when courts are occupied

## Best Practices

### **When Adding New Functions**
1. Use explicit table aliases (e.g., `cp.id`, `lni.court_labels`)
2. Cast COUNT() and other aggregates to expected types
3. Grant proper permissions after creation
4. Test functions individually before using in API

### **When Modifying Existing Functions**
1. Use `DROP FUNCTION IF EXISTS` before recreate
2. Test with real data to catch type mismatches
3. Update this documentation with any changes
4. Run through full match creation flow to verify

### **Debugging Function Issues**
1. Test functions directly in Supabase SQL Editor
2. Check for column ambiguity with multiple table joins
3. Verify return types match function signatures
4. Ensure proper permissions are granted

## Production Considerations

- **Performance**: Index frequently queried columns
- **Security**: Use RLS policies for all tables
- **Monitoring**: Log function execution times for optimization
- **Backup**: Regular database backups before schema changes

---

*Last Updated: September 19, 2025*
*Status: All functions operational and tested*