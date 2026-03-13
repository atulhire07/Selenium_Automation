`sync-location-items.js` clones items from a source NirvanaXP location into a target location using the Excel file provided by the user.

Run it with:

```powershell
$env:SYNC_USERNAME='laboulangerie'
$env:SYNC_PASSWORD='livefsr@1'
$env:SYNC_COMMIT='true'
node .\scripts\sync-location-items.js
```

Useful overrides:

- `SYNC_SOURCE_LOCATION_ID` defaults to `1`
- `SYNC_TARGET_LOCATION_ID` defaults to `66`
- `SYNC_EXCEL_PATH` defaults to `C:\Users\Admin\Downloads\La Boulangerie_50 items.xlsx`
- `SYNC_LIMIT` defaults to `50`
- `SYNC_COMMIT` defaults to dry run when unset
