@echo off
echo.
echo 🏐 Handball Live Match Tracking - Setup Script
echo ==============================================
echo.

REM Check if we're in the right directory
if not exist "artisan" (
    echo ❌ Error: Please run this script from the handball-website directory
    exit /b 1
)

echo 📦 Step 1: Running migrations...
php artisan migrate

if errorlevel 1 (
    echo ❌ Migration failed. Please check your database connection.
    exit /b 1
)

echo ✅ Migrations completed successfully!
echo.

echo 🔢 Step 2: Adding jersey numbers to players...
php artisan tinker --execute="$teams = App\Models\Team::with('players')->get(); foreach ($teams as $team) { $number = 1; foreach ($team->players as $player) { if (!$player->jersey_number) { $player->jersey_number = $number++; $player->save(); } } } echo 'Jersey numbers assigned!';"

echo ✅ Jersey numbers updated!
echo.

echo ==============================================
echo ✅ Setup Complete!
echo.
echo 📝 Next Steps:
echo 1. Start Laravel server: php artisan serve
echo 2. Start Next.js frontend: cd ..\handball-frontend ^&^& npm run dev
echo 3. Navigate to http://localhost:3000/admin/games
echo 4. Click the live tracking button on any game
echo.
echo 📚 Documentation:
echo - Laravel Setup: LARAVEL_SETUP_GUIDE.md
echo - API Docs: ..\handball-frontend\LIVE_MATCH_API.md
echo - Quick Start: ..\handball-frontend\QUICK_START_LIVE_TRACKING.md
echo.
echo 🎉 Happy tracking!
echo.
pause
