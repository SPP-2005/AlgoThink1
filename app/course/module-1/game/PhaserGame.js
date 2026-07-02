// ═══════════════════════════════════════════════════════════════════════
// SchoolPrepGame — A real 2D adventure game built with Phaser 3
// The entire house is one continuous side-scrolling world.
// The camera follows the character as they walk between rooms.
// ═══════════════════════════════════════════════════════════════════════

export function createSchoolPrepGame(Phaser, container, callbacks) {
    const W = 2400; // total world width
    const H = 480;  // world / viewport height
    const VIEW_W = 960;
    const FLOOR_Y = 380; // where the ground plane sits
    const CHAR_GROUND = FLOOR_Y - 8; // character feet

    // ── Room X-ranges ────────────────────────────────────────────────
    const ROOMS = {
        bedroom:  { x1: 0,    x2: 550 },
        bathroom: { x1: 550,  x2: 900 },
        kitchen:  { x1: 900,  x2: 1350 },
        hallway:  { x1: 1350, x2: 1700 },
        outside:  { x1: 1700, x2: 2400 },
    };

    // ── Target positions for each algorithm step ─────────────────────
    const STEP_TARGETS = {
        'Wake up':       { x: 160,  room: 'bedroom' },
        'Wear socks':    { x: 280,  room: 'bedroom' },
        'Pack bag':      { x: 460,  room: 'bedroom' },
        'Brush teeth':   { x: 720,  room: 'bathroom' },
        'Eat breakfast': { x: 1120, room: 'kitchen' },
        'Wear shoes':    { x: 1500, room: 'hallway' },
        'Leave home':    { x: 1650, room: 'hallway' },
    };

    // ── Shared mutable game state ────────────────────────────────────
    const state = {
        awake: false, brushed: false, eaten: false,
        socks: false, shoes: false, bag: false,
        executing: false,
    };

    // ══════════════════════════════════════════════════════════════════
    //  BOOT SCENE — generate all sprite textures, then start main
    // ══════════════════════════════════════════════════════════════════
    class BootScene extends Phaser.Scene {
        constructor() { super('boot'); }

        create() {
            this.generateTextures();
            this.scene.start('main');
        }

        generateTextures() {
            // ── Character head ──
            let g = this.make.graphics({ x: 0, y: 0 });
            // Hair back
            g.fillStyle(0x3b1a06);
            g.fillCircle(24, 18, 22);
            // Face
            g.fillStyle(0xf5c882);
            g.fillCircle(24, 22, 18);
            // Hair fringe
            g.fillStyle(0x3b1a06);
            g.fillRoundedRect(4, 0, 40, 16, 10);
            // Eyes
            g.fillStyle(0x1a1a2e);
            g.fillCircle(16, 22, 3.5);
            g.fillCircle(32, 22, 3.5);
            g.fillStyle(0xffffff);
            g.fillCircle(17, 21, 1.3);
            g.fillCircle(33, 21, 1.3);
            // Smile
            g.lineStyle(2, 0x1a1a2e, 1);
            g.beginPath();
            g.arc(24, 27, 5, Phaser.Math.DegToRad(10), Phaser.Math.DegToRad(170), false);
            g.strokePath();
            // Blush
            g.fillStyle(0xf5a0a0, 0.35);
            g.fillCircle(9, 28, 4);
            g.fillCircle(39, 28, 4);
            g.generateTexture('char-head', 48, 48);
            g.destroy();

            // ── Sleeping head ──
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x3b1a06);
            g.fillCircle(24, 18, 22);
            g.fillStyle(0xf5c882);
            g.fillCircle(24, 22, 18);
            g.fillStyle(0x3b1a06);
            g.fillRoundedRect(4, 0, 40, 16, 10);
            // Closed eyes (arcs)
            g.lineStyle(2.5, 0x1a1a2e, 1);
            g.beginPath();
            g.arc(16, 24, 4, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false);
            g.strokePath();
            g.beginPath();
            g.arc(32, 24, 4, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false);
            g.strokePath();
            g.fillStyle(0xf5a0a0, 0.35);
            g.fillCircle(9, 28, 4);
            g.fillCircle(39, 28, 4);
            g.generateTexture('char-head-sleep', 48, 48);
            g.destroy();

            // ── Sad / error head ──
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x3b1a06);
            g.fillCircle(24, 18, 22);
            g.fillStyle(0xf5c882);
            g.fillCircle(24, 22, 18);
            g.fillStyle(0x3b1a06);
            g.fillRoundedRect(4, 0, 40, 16, 10);
            g.fillStyle(0x1a1a2e);
            g.fillCircle(16, 22, 3.5);
            g.fillCircle(32, 22, 3.5);
            g.fillStyle(0xffffff);
            g.fillCircle(17, 21, 1.3);
            g.fillCircle(33, 21, 1.3);
            // Frown
            g.lineStyle(2, 0x1a1a2e, 1);
            g.beginPath();
            g.arc(24, 34, 5, Phaser.Math.DegToRad(190), Phaser.Math.DegToRad(350), false);
            g.strokePath();
            g.generateTexture('char-head-sad', 48, 48);
            g.destroy();

            // ── Brushing head ──
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x3b1a06);
            g.fillCircle(24, 18, 22);
            g.fillStyle(0xf5c882);
            g.fillCircle(24, 22, 18);
            g.fillStyle(0x3b1a06);
            g.fillRoundedRect(4, 0, 40, 16, 10);
            g.fillStyle(0x1a1a2e);
            g.fillCircle(16, 22, 3.5);
            g.fillCircle(32, 22, 3.5);
            g.fillStyle(0xffffff);
            g.fillCircle(17, 21, 1.3);
            g.fillCircle(33, 21, 1.3);
            // Open mouth
            g.fillStyle(0x1a1a2e);
            g.fillCircle(24, 30, 4);
            g.generateTexture('char-head-brush', 48, 48);
            g.destroy();

            // ── Toothbrush ──
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x60a5fa);
            g.fillRoundedRect(0, 0, 20, 6, 2);
            g.fillStyle(0xffffff);
            g.fillRoundedRect(12, -4, 6, 4, 1);
            g.generateTexture('char-toothbrush', 20, 10);
            g.destroy();

            // ── Backpack Straps ──
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x059669);
            g.fillRoundedRect(4, 0, 6, 36, 3);
            g.fillRoundedRect(22, 0, 6, 36, 3);
            g.generateTexture('char-straps', 32, 36);
            g.destroy();

            // ── Character torso ──
            g = this.make.graphics({ x: 0, y: 0 });
            // Neck
            g.fillStyle(0xf5c882);
            g.fillRect(10, 0, 12, 8);
            // Body
            g.fillStyle(0x3b82f6);
            g.fillRoundedRect(0, 6, 32, 34, 6);
            // Collar
            g.fillStyle(0xe8e8e8);
            g.fillTriangle(10, 6, 22, 6, 16, 16);
            // Buttons
            g.fillStyle(0xe8e8e8);
            g.fillCircle(16, 22, 2);
            g.fillCircle(16, 30, 2);
            g.generateTexture('char-body', 32, 40);
            g.destroy();

            // ── Arm ──
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x2563eb);
            g.fillRoundedRect(0, 0, 10, 26, 4);
            g.fillStyle(0xf5c882);
            g.fillCircle(5, 28, 5);
            g.generateTexture('char-arm', 12, 34);
            g.destroy();

            // ── Leg ──
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x334155);
            g.fillRoundedRect(0, 0, 12, 28, 3);
            g.generateTexture('char-leg', 12, 28);
            g.destroy();

            // ── Shoe ──
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0xdc2626);
            g.fillRoundedRect(0, 0, 16, 10, 4);
            g.generateTexture('char-shoe', 16, 10);
            g.destroy();

            // ── Bare foot ──
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0xf5c882);
            g.fillRoundedRect(0, 0, 14, 8, 3);
            g.generateTexture('char-barefoot', 14, 8);
            g.destroy();

            // ── Backpack ──
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x10b981);
            g.fillRoundedRect(0, 0, 22, 28, 6);
            g.lineStyle(2, 0x059669);
            g.strokeRoundedRect(0, 0, 22, 28, 6);
            g.fillStyle(0x059669);
            g.fillRoundedRect(4, 5, 14, 10, 3);
            g.generateTexture('backpack-on', 22, 28);
            g.destroy();

            // ── Inventory item icons ──
            this._genItemIcon('inv-socks', 0xffffff, (gg) => {
                gg.fillRoundedRect(2, 4, 8, 14, 3);
                gg.fillRoundedRect(14, 4, 8, 14, 3);
            });
            this._genItemIcon('inv-bag', 0x10b981, (gg) => {
                gg.fillRoundedRect(4, 2, 16, 18, 4);
            });
            this._genItemIcon('inv-brush', 0x60a5fa, (gg) => {
                gg.fillRect(10, 2, 4, 16);
                gg.fillRoundedRect(6, 0, 12, 6, 2);
            });
            this._genItemIcon('inv-food', 0xfbbf24, (gg) => {
                gg.fillCircle(12, 12, 8);
                gg.fillStyle(0xef4444);
                gg.fillCircle(12, 10, 4);
            });
            this._genItemIcon('inv-shoes', 0xdc2626, (gg) => {
                gg.fillRoundedRect(2, 8, 9, 10, 3);
                gg.fillRoundedRect(13, 8, 9, 10, 3);
            });
        }

        _genItemIcon(key, color, drawFn) {
            const g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(color);
            drawFn(g);
            g.generateTexture(key, 24, 24);
            g.destroy();
        }
    }

    // ══════════════════════════════════════════════════════════════════
    //  MAIN SCENE — the entire scrolling world + character + HUD
    // ══════════════════════════════════════════════════════════════════
    class MainScene extends Phaser.Scene {
        constructor() { super('main'); }

        create() {
            // Draw the world
            this.drawBedroom();
            this.drawBathroom();
            this.drawKitchen();
            this.drawHallway();
            this.drawOutside();

            // Room dividers (walls between rooms)
            this.drawDoorway(ROOMS.bedroom.x2, 0x2d1b69, 0x1a6b7a);
            this.drawDoorway(ROOMS.bathroom.x2, 0x1a6b7a, 0x78541f);
            this.drawDoorway(ROOMS.kitchen.x2, 0x78541f, 0x44403c);

            // Create character
            this.createCharacter(160, CHAR_GROUND);

            // Put character to sleep initially
            this.charHead.setTexture('char-head-sleep');
            this.charContainer.setAngle(90);
            this.charContainer.setPosition(130, FLOOR_Y - 80);

            // Create interactive object highlights
            this.highlights = {};
            this.createObjectHighlights();

            // HUD (fixed to camera)
            this.createHUD();

            // Camera
            this.cameras.main.setBounds(0, 0, W, H);
            this.cameras.main.startFollow(this.charContainer, true, 0.08, 0.08);

            // Zzz particles for sleeping
            this.zzzText = this.add.text(190, CHAR_GROUND - 110, 'z z z', {
                fontSize: '18px', fontFamily: 'monospace', color: '#a78bfa',
            }).setAlpha(0.8);
            this.tweens.add({
                targets: this.zzzText,
                y: CHAR_GROUND - 130, alpha: 0,
                duration: 2000, yoyo: true, repeat: -1,
            });

            // Listen for algorithm execution
            this.game.events.on('execute-algorithm', this.onExecute, this);
            this.game.events.on('reset-game', this.onReset, this);
        }

        // ── Drawing: Bedroom ──────────────────────────────────────────
        drawBedroom() {
            const r = ROOMS.bedroom;
            const g = this.add.graphics();

            // Wall
            g.fillGradientStyle(0x2d1b69, 0x2d1b69, 0x1e1250, 0x1e1250, 1);
            g.fillRect(r.x1, 0, r.x2 - r.x1, FLOOR_Y);

            // Wallpaper pattern (subtle stripes)
            g.lineStyle(1, 0x3b2578, 0.3);
            for (let x = r.x1 + 20; x < r.x2; x += 40) {
                g.lineBetween(x, 0, x, FLOOR_Y);
            }

            // Floor — wooden planks
            this.drawWoodFloor(g, r.x1, r.x2 - r.x1);

            // Baseboard
            g.fillStyle(0x1a0f3d);
            g.fillRect(r.x1, FLOOR_Y - 8, r.x2 - r.x1, 8);

            // ── Window ──
            g.fillStyle(0x0f172a);
            g.fillRect(350, 60, 120, 140);
            g.lineStyle(4, 0x8b7355);
            g.strokeRect(348, 58, 124, 144);
            // Cross bar
            g.lineBetween(410, 58, 410, 202);
            g.lineBetween(348, 130, 472, 130);
            // Stars
            g.fillStyle(0xfef08a, 0.8);
            g.fillCircle(375, 90, 2);
            g.fillCircle(440, 100, 1.5);
            g.fillCircle(395, 150, 1.8);
            g.fillCircle(450, 140, 2);
            // Moon
            g.fillStyle(0xfef9c3, 0.9);
            g.fillCircle(390, 110, 12);
            g.fillStyle(0x0f172a);
            g.fillCircle(396, 106, 10);
            // Curtains
            g.fillStyle(0x6d28d9, 0.6);
            g.fillRect(340, 50, 25, 160);
            g.fillRect(468, 50, 25, 160);

            // ── Bed ──
            // Frame
            g.fillStyle(0x6b4423);
            g.fillRect(80, FLOOR_Y - 90, 160, 90);
            // Headboard
            g.fillStyle(0x5a3a1e);
            g.fillRoundedRect(75, FLOOR_Y - 140, 20, 145, 6);
            // Mattress
            g.fillStyle(0xe8e8e8);
            g.fillRoundedRect(95, FLOOR_Y - 80, 140, 35, 4);
            // Blanket
            g.fillStyle(0x6366f1, 0.85);
            g.fillRoundedRect(95, FLOOR_Y - 50, 140, 50, 4);
            g.fillStyle(0x818cf8, 0.5);
            g.fillRoundedRect(95, FLOOR_Y - 50, 140, 12, { tl: 4, tr: 4, bl: 0, br: 0 });
            // Pillow
            g.fillStyle(0xf0f0f0);
            g.fillRoundedRect(100, FLOOR_Y - 78, 50, 25, 8);

            // ── Nightstand ──
            g.fillStyle(0x5a3a1e);
            g.fillRect(250, FLOOR_Y - 60, 45, 60);
            g.fillStyle(0x6b4423);
            g.fillRect(248, FLOOR_Y - 62, 49, 6);
            // Lamp
            g.fillStyle(0xfbbf24, 0.6);
            g.fillTriangle(263, FLOOR_Y - 100, 283, FLOOR_Y - 100, 273, FLOOR_Y - 62);
            g.fillStyle(0x6b4423);
            g.fillRect(270, FLOOR_Y - 100, 6, 4);
            // Alarm clock
            g.fillStyle(0xef4444);
            g.fillCircle(262, FLOOR_Y - 72, 10);
            g.fillStyle(0xffffff);
            g.fillCircle(262, FLOOR_Y - 72, 7);
            g.fillStyle(0x1a1a2e);
            g.fillCircle(262, FLOOR_Y - 72, 1);
            g.lineStyle(1, 0x1a1a2e);
            g.lineBetween(262, FLOOR_Y - 72, 262, FLOOR_Y - 77);
            g.lineBetween(262, FLOOR_Y - 72, 267, FLOOR_Y - 72);

            // ── Socks on floor ──
            this.socksObj = this.add.graphics();
            this.socksObj.fillStyle(0xf0f0f0);
            this.socksObj.fillRoundedRect(270, FLOOR_Y - 18, 14, 18, 4);
            this.socksObj.fillRoundedRect(290, FLOOR_Y - 16, 14, 16, 4);
            this.socksObj.lineStyle(1, 0xd1d5db);
            this.socksObj.strokeRoundedRect(270, FLOOR_Y - 18, 14, 18, 4);
            this.socksObj.strokeRoundedRect(290, FLOOR_Y - 16, 14, 16, 4);

            // ── Desk area ──
            // Desk
            g.fillStyle(0x8b6914);
            g.fillRect(400, FLOOR_Y - 80, 120, 8);
            g.fillStyle(0x6b4423);
            g.fillRect(405, FLOOR_Y - 72, 8, 72);
            g.fillRect(507, FLOOR_Y - 72, 8, 72);
            // Chair
            g.fillStyle(0x64748b);
            g.fillRoundedRect(430, FLOOR_Y - 60, 40, 5, 2);
            g.fillRect(435, FLOOR_Y - 55, 4, 55);
            g.fillRect(461, FLOOR_Y - 55, 4, 55);
            g.fillStyle(0x64748b);
            g.fillRoundedRect(430, FLOOR_Y - 95, 40, 35, { tl: 6, tr: 6, bl: 0, br: 0 });
            // Books on desk
            g.fillStyle(0xef4444);
            g.fillRect(410, FLOOR_Y - 100, 25, 20);
            g.fillStyle(0x3b82f6);
            g.fillRect(418, FLOOR_Y - 104, 25, 20);
            g.fillStyle(0x22c55e);
            g.fillRect(426, FLOOR_Y - 98, 25, 16);

            // ── School bag on desk ──
            this.bagObj = this.add.graphics();
            this.bagObj.fillStyle(0x10b981);
            this.bagObj.fillRoundedRect(470, FLOOR_Y - 115, 30, 35, 8);
            this.bagObj.lineStyle(2, 0x059669);
            this.bagObj.strokeRoundedRect(470, FLOOR_Y - 115, 30, 35, 8);
            this.bagObj.fillStyle(0x059669);
            this.bagObj.fillRoundedRect(475, FLOOR_Y - 108, 20, 12, 3);

            // ── Rug ──
            g.fillStyle(0xdc2626, 0.2);
            g.fillEllipse(320, FLOOR_Y + 20, 120, 30);
            g.lineStyle(1, 0xef4444, 0.3);
            g.strokeEllipse(320, FLOOR_Y + 20, 120, 30);

            // ── Poster on wall ──
            g.fillStyle(0xfbbf24, 0.7);
            g.fillRect(170, 80, 60, 80);
            g.lineStyle(2, 0x78350f, 0.5);
            g.strokeRect(170, 80, 60, 80);
            g.fillStyle(0x1e293b, 0.5);
            g.fillRect(180, 120, 40, 8);
            g.fillRect(180, 134, 30, 5);
        }

        // ── Drawing: Bathroom ─────────────────────────────────────────
        drawBathroom() {
            const r = ROOMS.bathroom;
            const g = this.add.graphics();

            // Wall — light blue tiles
            g.fillStyle(0xbae6fd);
            g.fillRect(r.x1, 0, r.x2 - r.x1, FLOOR_Y);
            // Tile grid
            g.lineStyle(1, 0x93c5fd, 0.4);
            for (let x = r.x1; x < r.x2; x += 30) {
                g.lineBetween(x, 0, x, FLOOR_Y);
            }
            for (let y = 0; y < FLOOR_Y; y += 30) {
                g.lineBetween(r.x1, y, r.x2, y);
            }

            // Floor — white tile
            this.drawTiledFloor(g, r.x1, r.x2 - r.x1);

            // Baseboard
            g.fillStyle(0x94a3b8);
            g.fillRect(r.x1, FLOOR_Y - 8, r.x2 - r.x1, 8);

            // ── Mirror ──
            g.fillStyle(0xe0f2fe, 0.6);
            g.fillRoundedRect(680, 50, 80, 100, 10);
            g.lineStyle(3, 0x94a3b8);
            g.strokeRoundedRect(680, 50, 80, 100, 10);
            // Reflection highlight
            g.fillStyle(0xffffff, 0.3);
            g.fillRoundedRect(688, 58, 20, 40, 6);

            // ── Sink ──
            g.fillStyle(0xf1f5f9);
            g.fillRoundedRect(680, FLOOR_Y - 90, 80, 20, 4);
            // Basin
            g.fillStyle(0xe2e8f0);
            g.fillRoundedRect(695, FLOOR_Y - 85, 50, 15, { tl: 0, tr: 0, bl: 8, br: 8 });
            // Pedestal
            g.fillStyle(0xf1f5f9);
            g.fillRect(710, FLOOR_Y - 70, 20, 70);
            // Faucet
            g.fillStyle(0x94a3b8);
            g.fillRect(717, FLOOR_Y - 105, 6, 15);
            g.fillRoundedRect(710, FLOOR_Y - 108, 20, 8, 3);

            // ── Toothbrush holder ──
            g.fillStyle(0x60a5fa);
            g.fillRoundedRect(770, FLOOR_Y - 105, 12, 20, 3);
            // Toothbrush
            g.fillStyle(0x22c55e);
            g.fillRect(773, FLOOR_Y - 120, 3, 18);
            g.fillStyle(0xffffff);
            g.fillRoundedRect(771, FLOOR_Y - 124, 7, 6, 2);

            // ── Towel rack ──
            g.fillStyle(0x94a3b8);
            g.fillRect(600, 160, 50, 4);
            g.fillStyle(0x60a5fa, 0.7);
            g.fillRect(605, 164, 40, 50);

            // ── Bath mat ──
            g.fillStyle(0x60a5fa, 0.3);
            g.fillRoundedRect(690, FLOOR_Y - 5, 60, 10, 3);
        }

        // ── Drawing: Kitchen ──────────────────────────────────────────
        drawKitchen() {
            const r = ROOMS.kitchen;
            const g = this.add.graphics();

            // Wall — warm cream
            g.fillGradientStyle(0xfef3c7, 0xfef3c7, 0xfde68a, 0xfde68a, 1);
            g.fillRect(r.x1, 0, r.x2 - r.x1, FLOOR_Y);

            // Floor
            this.drawCheckerFloor(g, r.x1, r.x2 - r.x1);

            // Baseboard
            g.fillStyle(0xb45309, 0.5);
            g.fillRect(r.x1, FLOOR_Y - 8, r.x2 - r.x1, 8);

            // ── Window with morning light ──
            g.fillStyle(0x7dd3fc);
            g.fillRect(980, 50, 100, 120);
            g.lineStyle(4, 0x8b7355);
            g.strokeRect(978, 48, 104, 124);
            g.lineBetween(1030, 48, 1030, 172);
            g.lineBetween(978, 110, 1082, 110);
            // Sun glow
            g.fillStyle(0xfef08a, 0.5);
            g.fillCircle(1030, 90, 20);
            g.fillStyle(0xfef08a, 0.2);
            g.fillCircle(1030, 90, 35);

            // ── Kitchen counter (background) ──
            g.fillStyle(0xb45309);
            g.fillRect(r.x1 + 10, FLOOR_Y - 120, r.x2 - r.x1 - 20, 8);
            g.fillStyle(0x78350f);
            g.fillRect(r.x1 + 10, FLOOR_Y - 112, r.x2 - r.x1 - 20, 112);
            // Cabinet doors
            for (let cx = r.x1 + 20; cx < r.x2 - 40; cx += 60) {
                g.lineStyle(1, 0x92400e, 0.5);
                g.strokeRect(cx, FLOOR_Y - 108, 50, 50);
                g.fillStyle(0xb45309, 0.3);
                g.fillCircle(cx + 40, FLOOR_Y - 83, 3);
            }

            // ── Fridge ──
            g.fillStyle(0xd1d5db);
            g.fillRoundedRect(1240, FLOOR_Y - 180, 70, 180, 4);
            g.lineStyle(1, 0x9ca3af);
            g.strokeRoundedRect(1240, FLOOR_Y - 180, 70, 180, 4);
            g.lineBetween(1240, FLOOR_Y - 80, 1310, FLOOR_Y - 80);
            g.fillStyle(0x6b7280);
            g.fillRect(1300, FLOOR_Y - 140, 4, 20);
            g.fillRect(1300, FLOOR_Y - 60, 4, 15);

            // ── Table ──
            g.fillStyle(0xa3611a);
            g.fillRoundedRect(1070, FLOOR_Y - 70, 130, 8, 3);
            g.fillStyle(0x8b5014);
            g.fillRect(1080, FLOOR_Y - 62, 8, 62);
            g.fillRect(1182, FLOOR_Y - 62, 8, 62);

            // ── Chair ──
            g.fillStyle(0x78350f);
            g.fillRoundedRect(1110, FLOOR_Y - 55, 35, 5, 2);
            g.fillRect(1115, FLOOR_Y - 50, 4, 50);
            g.fillRect(1137, FLOOR_Y - 50, 4, 50);
            g.fillRoundedRect(1110, FLOOR_Y - 85, 35, 30, { tl: 4, tr: 4, bl: 0, br: 0 });

            // ── Plate of food on table ──
            g.fillStyle(0xf1f5f9);
            g.fillCircle(1135, FLOOR_Y - 78, 18);
            g.lineStyle(1, 0xd1d5db);
            g.strokeCircle(1135, FLOOR_Y - 78, 18);
            // Food
            g.fillStyle(0xfbbf24);
            g.fillCircle(1130, FLOOR_Y - 80, 8); // pancake
            g.fillStyle(0xef4444);
            g.fillCircle(1142, FLOOR_Y - 82, 5); // fruit
            g.fillStyle(0x22c55e);
            g.fillCircle(1127, FLOOR_Y - 85, 3); // garnish

            // ── Glass ──
            g.fillStyle(0xbae6fd, 0.6);
            g.fillRoundedRect(1160, FLOOR_Y - 92, 12, 18, 2);
            g.lineStyle(1, 0x7dd3fc);
            g.strokeRoundedRect(1160, FLOOR_Y - 92, 12, 18, 2);
        }

        // ── Drawing: Hallway ──────────────────────────────────────────
        drawHallway() {
            const r = ROOMS.hallway;
            const g = this.add.graphics();

            // Wall — warm grey/beige
            g.fillGradientStyle(0x57534e, 0x57534e, 0x44403c, 0x44403c, 1);
            g.fillRect(r.x1, 0, r.x2 - r.x1, FLOOR_Y);

            // Floor
            this.drawWoodFloor(g, r.x1, r.x2 - r.x1, 0x5a3a1e);

            // Baseboard
            g.fillStyle(0x292524);
            g.fillRect(r.x1, FLOOR_Y - 8, r.x2 - r.x1, 8);

            // ── Coat hooks ──
            for (let hx = r.x1 + 40; hx < r.x1 + 140; hx += 30) {
                g.fillStyle(0x94a3b8);
                g.fillCircle(hx, 140, 4);
                g.fillRect(hx - 1, 140, 2, 8);
            }
            // Jacket
            g.fillStyle(0xef4444, 0.6);
            g.fillTriangle(r.x1 + 55, 148, r.x1 + 35, 210, r.x1 + 75, 210);

            // ── Shoe rack ──
            g.fillStyle(0x78350f);
            g.fillRect(1460, FLOOR_Y - 40, 80, 6);
            g.fillRect(1460, FLOOR_Y - 20, 80, 6);
            g.fillRect(1460, FLOOR_Y - 42, 6, 42);
            g.fillRect(1534, FLOOR_Y - 42, 6, 42);
            // Shoes on rack
            this.shoesObj = this.add.graphics();
            this.shoesObj.fillStyle(0xdc2626);
            this.shoesObj.fillRoundedRect(1470, FLOOR_Y - 36, 22, 12, 4);
            this.shoesObj.fillRoundedRect(1500, FLOOR_Y - 36, 22, 12, 4);
            this.shoesObj.fillStyle(0x1e40af);
            this.shoesObj.fillRoundedRect(1470, FLOOR_Y - 18, 22, 12, 4);

            // ── Front door ──
            g.fillStyle(0x78350f);
            g.fillRoundedRect(1620, FLOOR_Y - 200, 70, 200, { tl: 6, tr: 6, bl: 0, br: 0 });
            g.lineStyle(2, 0x5a2d0c);
            g.strokeRoundedRect(1620, FLOOR_Y - 200, 70, 200, { tl: 6, tr: 6, bl: 0, br: 0 });
            // Door panels
            g.lineStyle(1, 0x5a2d0c, 0.5);
            g.strokeRect(1630, FLOOR_Y - 185, 50, 60);
            g.strokeRect(1630, FLOOR_Y - 110, 50, 60);
            // Door handle
            g.fillStyle(0xfbbf24);
            g.fillCircle(1680, FLOOR_Y - 100, 5);
            g.fillStyle(0xd97706);
            g.fillCircle(1680, FLOOR_Y - 100, 2);

            // ── Welcome mat ──
            g.fillStyle(0x78350f, 0.4);
            g.fillRoundedRect(1630, FLOOR_Y - 4, 50, 10, 2);
        }

        // ── Drawing: Outside ──────────────────────────────────────────
        drawOutside() {
            const r = ROOMS.outside;
            const g = this.add.graphics();

            // Sky gradient
            g.fillGradientStyle(0x38bdf8, 0x7dd3fc, 0xbae6fd, 0xe0f2fe, 1);
            g.fillRect(r.x1, 0, r.x2 - r.x1, FLOOR_Y);

            // Sun
            g.fillStyle(0xfef08a, 0.3);
            g.fillCircle(2100, 70, 60);
            g.fillStyle(0xfef08a, 0.6);
            g.fillCircle(2100, 70, 35);
            g.fillStyle(0xfef08a);
            g.fillCircle(2100, 70, 20);

            // Clouds
            this.drawCloud(g, 1780, 60, 1.0);
            this.drawCloud(g, 1950, 100, 0.7);
            this.drawCloud(g, 2200, 50, 1.2);

            // Grass
            g.fillStyle(0x4ade80);
            g.fillRect(r.x1, FLOOR_Y, r.x2 - r.x1, H - FLOOR_Y);
            g.fillStyle(0x22c55e);
            g.fillRect(r.x1, FLOOR_Y, r.x2 - r.x1, 10);

            // Path / sidewalk
            g.fillStyle(0xd6d3d1);
            g.fillRect(r.x1, FLOOR_Y + 15, r.x2 - r.x1, 40);
            g.lineStyle(1, 0xa8a29e, 0.5);
            for (let px = r.x1 + 20; px < r.x2; px += 50) {
                g.lineBetween(px, FLOOR_Y + 15, px, FLOOR_Y + 55);
            }

            // Trees
            this.drawTree(g, 1780, FLOOR_Y - 10);
            this.drawTree(g, 1920, FLOOR_Y - 10);
            this.drawTree(g, 2050, FLOOR_Y - 10);

            // Fence
            g.lineStyle(2, 0xa8a29e);
            g.lineBetween(r.x1 + 20, FLOOR_Y - 25, 2100, FLOOR_Y - 25);
            for (let fx = r.x1 + 30; fx < 2100; fx += 30) {
                g.lineBetween(fx, FLOOR_Y - 40, fx, FLOOR_Y - 10);
            }

            // ── School building ──
            // Main building
            g.fillStyle(0xfca5a5);
            g.fillRect(2120, FLOOR_Y - 200, 200, 200);
            g.lineStyle(2, 0xef4444);
            g.strokeRect(2120, FLOOR_Y - 200, 200, 200);
            // Roof
            g.fillStyle(0x64748b);
            g.fillTriangle(2100, FLOOR_Y - 200, 2220, FLOOR_Y - 260, 2340, FLOOR_Y - 200);
            g.lineStyle(2, 0x475569);
            g.strokeTriangle(2100, FLOOR_Y - 200, 2220, FLOOR_Y - 260, 2340, FLOOR_Y - 200);
            // Clock
            g.fillStyle(0xffffff);
            g.fillCircle(2220, FLOOR_Y - 225, 16);
            g.lineStyle(2, 0x1e293b);
            g.strokeCircle(2220, FLOOR_Y - 225, 16);
            g.lineBetween(2220, FLOOR_Y - 225, 2220, FLOOR_Y - 235);
            g.lineBetween(2220, FLOOR_Y - 225, 2228, FLOOR_Y - 225);
            // Windows
            for (let wy = FLOOR_Y - 180; wy < FLOOR_Y - 40; wy += 55) {
                for (let wx = 2140; wx < 2300; wx += 50) {
                    if (wx > 2190 && wx < 2240 && wy > FLOOR_Y - 80) continue; // skip door area
                    g.fillStyle(0xbae6fd);
                    g.fillRect(wx, wy, 30, 35);
                    g.lineStyle(1, 0x64748b);
                    g.strokeRect(wx, wy, 30, 35);
                    g.lineBetween(wx + 15, wy, wx + 15, wy + 35);
                    g.lineBetween(wx, wy + 17, wx + 30, wy + 17);
                }
            }
            // Door
            g.fillStyle(0x78350f);
            g.fillRoundedRect(2200, FLOOR_Y - 70, 40, 70, { tl: 6, tr: 6, bl: 0, br: 0 });
            g.fillStyle(0xfbbf24);
            g.fillCircle(2232, FLOOR_Y - 35, 4);
            // Sign
            g.fillStyle(0x1e293b, 0.8);
            g.fillRoundedRect(2175, FLOOR_Y - 90, 90, 20, 4);
            this.add.text(2183, FLOOR_Y - 87, 'SCHOOL', {
                fontSize: '13px', fontFamily: 'Arial, sans-serif',
                color: '#ffffff', fontStyle: 'bold',
            });

            // Flowers
            for (let fx = r.x1 + 60; fx < 2100; fx += 40) {
                const fc = [0xf472b6, 0xfbbf24, 0xa78bfa, 0x34d399][Math.floor(Math.random() * 4)];
                g.fillStyle(0x22c55e);
                g.fillRect(fx, FLOOR_Y - 5, 2, 12);
                g.fillStyle(fc);
                g.fillCircle(fx + 1, FLOOR_Y - 8, 4);
            }
        }

        // ── Drawing helpers ───────────────────────────────────────────
        drawWoodFloor(g, x, w, color = 0x8b6914) {
            g.fillStyle(color);
            g.fillRect(x, FLOOR_Y, w, H - FLOOR_Y);
            g.lineStyle(1, 0x6b4423, 0.3);
            for (let px = x; px < x + w; px += 50) {
                g.lineBetween(px, FLOOR_Y, px, H);
            }
            for (let py = FLOOR_Y + 15; py < H; py += 15) {
                g.lineBetween(x, py, x + w, py);
            }
        }

        drawTiledFloor(g, x, w) {
            g.fillStyle(0xf1f5f9);
            g.fillRect(x, FLOOR_Y, w, H - FLOOR_Y);
            g.lineStyle(1, 0xe2e8f0, 0.6);
            for (let px = x; px < x + w; px += 25) {
                g.lineBetween(px, FLOOR_Y, px, H);
            }
            for (let py = FLOOR_Y; py < H; py += 25) {
                g.lineBetween(x, py, x + w, py);
            }
        }

        drawCheckerFloor(g, x, w) {
            const size = 30;
            for (let py = FLOOR_Y; py < H; py += size) {
                for (let px = x; px < x + w; px += size) {
                    const isLight = ((px - x) / size + (py - FLOOR_Y) / size) % 2 === 0;
                    g.fillStyle(isLight ? 0xfef3c7 : 0xfde68a, isLight ? 0.8 : 0.5);
                    g.fillRect(px, py, size, size);
                }
            }
        }

        drawDoorway(x, leftColor, rightColor) {
            const g = this.add.graphics();
            // Frame
            g.fillStyle(0x8b7355);
            g.fillRect(x - 6, FLOOR_Y - 180, 12, 180);
            g.fillRect(x - 30, FLOOR_Y - 185, 60, 10);
        }

        drawCloud(g, x, y, scale) {
            g.fillStyle(0xffffff, 0.7);
            g.fillCircle(x, y, 18 * scale);
            g.fillCircle(x + 22 * scale, y - 5 * scale, 22 * scale);
            g.fillCircle(x + 48 * scale, y, 16 * scale);
            g.fillCircle(x + 25 * scale, y + 5 * scale, 14 * scale);
        }

        drawTree(g, x, y) {
            // Trunk
            g.fillStyle(0x78350f);
            g.fillRect(x - 6, y - 60, 12, 65);
            // Canopy
            g.fillStyle(0x16a34a);
            g.fillCircle(x, y - 70, 30);
            g.fillStyle(0x22c55e);
            g.fillCircle(x - 10, y - 60, 22);
            g.fillCircle(x + 12, y - 65, 24);
            g.fillStyle(0x15803d, 0.5);
            g.fillCircle(x + 5, y - 80, 18);
        }

        // ── Character creation ────────────────────────────────────────
        createCharacter(x, y) {
            this.charContainer = this.add.container(x, y);

            // Shadow
            const shadow = this.add.graphics();
            shadow.fillStyle(0x000000, 0.2);
            shadow.fillEllipse(0, 5, 40, 12);

            // Legs (pivot at hip for swing animation)
            this.charLeftLeg = this.add.sprite(-6, -5, 'char-leg').setOrigin(0.5, 0);
            this.charRightLeg = this.add.sprite(6, -5, 'char-leg').setOrigin(0.5, 0);

            // Feet
            this.charLeftFoot = this.add.sprite(-6, 22, 'char-barefoot').setOrigin(0.5, 0);
            this.charRightFoot = this.add.sprite(6, 22, 'char-barefoot').setOrigin(0.5, 0);

            // Body
            this.charBody = this.add.sprite(0, -40, 'char-body').setOrigin(0.5, 0);

            // Backpack (behind body, hidden initially)
            this.charBackpack = this.add.sprite(-14, -36, 'backpack-on').setOrigin(0.5, 0).setVisible(false);

            // Straps (in front of body, hidden initially)
            this.charStraps = this.add.sprite(0, -36, 'char-straps').setOrigin(0.5, 0).setVisible(false);

            // Arms
            this.charLeftArm = this.add.sprite(-18, -38, 'char-arm').setOrigin(0.5, 0);
            this.charRightArm = this.add.sprite(18, -38, 'char-arm').setOrigin(0.5, 0);

            // Head
            this.charHead = this.add.sprite(0, -62, 'char-head').setOrigin(0.5, 0.5);

            // Toothbrush (in hand, hidden initially)
            this.charToothbrush = this.add.sprite(20, -50, 'char-toothbrush').setOrigin(0.5, 0.5).setVisible(false);

            this.charContainer.add([
                shadow,
                this.charLeftLeg, this.charRightLeg,
                this.charLeftFoot, this.charRightFoot,
                this.charBackpack,
                this.charBody,
                this.charStraps,
                this.charLeftArm, this.charRightArm,
                this.charHead,
                this.charToothbrush
            ]);

            this.charContainer.setDepth(100);
        }

        // ── Object highlights (glow rectangles) ──────────────────────
        createObjectHighlights() {
            // These are semi-transparent rectangles that pulse to show interactable objects
            const mkHighlight = (x, y, w, h, key) => {
                const rect = this.add.rectangle(x, y, w, h, 0xfbbf24, 0)
                    .setStrokeStyle(2, 0xfbbf24, 0)
                    .setOrigin(0, 0)
                    .setDepth(50);
                this.highlights[key] = rect;
                return rect;
            };

            mkHighlight(80, FLOOR_Y - 90, 160, 90, 'Wake up');      // Bed
            mkHighlight(265, FLOOR_Y - 22, 45, 22, 'Wear socks');   // Socks
            mkHighlight(400, FLOOR_Y - 120, 120, 40, 'Pack bag');    // Desk
            mkHighlight(680, FLOOR_Y - 110, 100, 40, 'Brush teeth'); // Sink
            mkHighlight(1070, FLOOR_Y - 90, 130, 30, 'Eat breakfast'); // Table
            mkHighlight(1460, FLOOR_Y - 42, 80, 42, 'Wear shoes');  // Shoe rack
            mkHighlight(1620, FLOOR_Y - 200, 70, 200, 'Leave home'); // Door
        }

        pulseHighlight(key) {
            const h = this.highlights[key];
            if (!h) return;
            h.setFillStyle(0xfbbf24, 0.15);
            h.setStrokeStyle(2, 0xfbbf24, 0.8);
            this.tweens.add({
                targets: h,
                alpha: { from: 0.5, to: 1 },
                duration: 600,
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    h.setFillStyle(0xfbbf24, 0);
                    h.setStrokeStyle(2, 0xfbbf24, 0);
                    h.setAlpha(1);
                },
            });
        }

        // ── HUD ───────────────────────────────────────────────────────
        createHUD() {
            // Semi-transparent bar at the top
            this.hudBg = this.add.rectangle(VIEW_W / 2, 22, VIEW_W - 20, 36, 0x0f172a, 0.7)
                .setScrollFactor(0).setDepth(200).setStrokeStyle(1, 0x334155);

            this.hudLabel = this.add.text(20, 10, 'MISSION: Get Ready For School', {
                fontSize: '14px', fontFamily: 'Arial, sans-serif',
                color: '#60a5fa', fontStyle: 'bold',
            }).setScrollFactor(0).setDepth(201);

            // Inventory slots
            this.invSlots = [];
            const items = [
                { key: 'inv-socks', label: 'Socks', stateKey: 'socks' },
                { key: 'inv-brush', label: 'Brush', stateKey: 'brushed' },
                { key: 'inv-food',  label: 'Food',  stateKey: 'eaten' },
                { key: 'inv-bag',   label: 'Bag',   stateKey: 'bag' },
                { key: 'inv-shoes', label: 'Shoes', stateKey: 'shoes' },
            ];
            items.forEach((item, i) => {
                const sx = VIEW_W - 200 + i * 36;
                const bg = this.add.rectangle(sx, 22, 30, 30, 0x1e293b, 0.8)
                    .setScrollFactor(0).setDepth(201).setStrokeStyle(1, 0x334155);
                const icon = this.add.sprite(sx, 22, item.key)
                    .setScrollFactor(0).setDepth(202).setAlpha(0.3);
                this.invSlots.push({ bg, icon, stateKey: item.stateKey });
            });

            // Step display
            this.stepText = this.add.text(VIEW_W / 2, H - 30, '', {
                fontSize: '16px', fontFamily: 'Arial, sans-serif',
                color: '#fbbf24', fontStyle: 'bold',
            }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);

            this.stepBg = this.add.rectangle(VIEW_W / 2, H - 30, 300, 28, 0x0f172a, 0.8)
                .setScrollFactor(0).setDepth(200).setAlpha(0).setStrokeStyle(1, 0x334155);
        }

        updateHUD() {
            this.invSlots.forEach(slot => {
                slot.icon.setAlpha(state[slot.stateKey] ? 1 : 0.3);
                if (state[slot.stateKey]) {
                    slot.bg.setStrokeStyle(1, 0x22c55e);
                }
            });
        }

        showStepLabel(text) {
            this.stepText.setText(text).setAlpha(1);
            this.stepBg.setAlpha(1);
            this.tweens.add({
                targets: [this.stepText, this.stepBg],
                alpha: 0,
                duration: 500,
                delay: 2000,
            });
        }

        // ── Character movement ────────────────────────────────────────
        walkTo(targetX) {
            return new Promise(resolve => {
                const dist = Math.abs(targetX - this.charContainer.x);
                if (dist < 5) { resolve(); return; }

                const duration = dist * 4; // speed: ~250px/sec
                const dir = targetX > this.charContainer.x ? 1 : -1;

                // Flip character to face direction
                this.charContainer.setScale(dir, 1);

                // Start walk animation
                this.startWalkAnim();

                this.tweens.add({
                    targets: this.charContainer,
                    x: targetX,
                    duration: Math.max(duration, 400),
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        this.stopWalkAnim();
                        this.charContainer.setScale(1, 1); // face right
                        resolve();
                    },
                });
            });
        }

        startWalkAnim() {
            if (this.walkTween) return;

            // Leg swing
            this.walkTween = this.tweens.add({
                targets: this.charLeftLeg,
                angle: { from: -20, to: 20 },
                duration: 250,
                yoyo: true, repeat: -1,
            });
            this.tweens.add({
                targets: this.charRightLeg,
                angle: { from: 20, to: -20 },
                duration: 250,
                yoyo: true, repeat: -1,
            });

            // Foot follows leg
            this.tweens.add({
                targets: this.charLeftFoot,
                angle: { from: -15, to: 15 },
                duration: 250,
                yoyo: true, repeat: -1,
            });
            this.tweens.add({
                targets: this.charRightFoot,
                angle: { from: 15, to: -15 },
                duration: 250,
                yoyo: true, repeat: -1,
            });

            // Arm swing
            this.tweens.add({
                targets: this.charLeftArm,
                angle: { from: 15, to: -15 },
                duration: 250,
                yoyo: true, repeat: -1,
            });
            this.tweens.add({
                targets: this.charRightArm,
                angle: { from: -15, to: 15 },
                duration: 250,
                yoyo: true, repeat: -1,
            });

            // Body bob
            this.tweens.add({
                targets: this.charBody,
                y: { from: -42, to: -38 },
                duration: 125,
                yoyo: true, repeat: -1,
            });
            this.tweens.add({
                targets: this.charHead,
                y: { from: -74, to: -70 },
                duration: 125,
                yoyo: true, repeat: -1,
            });
        }

        stopWalkAnim() {
            this.walkTween = null;
            this.tweens.killAll();
            // Reset all parts
            [this.charLeftLeg, this.charRightLeg, this.charLeftFoot,
             this.charRightFoot, this.charLeftArm, this.charRightArm].forEach(p => {
                p.setAngle(0);
            });
            this.charBody.setY(-40);
            this.charHead.setY(-72);

            // Restart HUD tweens if needed
            this.cameras.main.startFollow(this.charContainer, true, 0.08, 0.08);
        }

        // ── Interaction animations ────────────────────────────────────
        playPickupAnim() {
            return new Promise(resolve => {
                // Character bends down
                this.tweens.add({
                    targets: this.charContainer,
                    scaleY: 0.7,
                    duration: 300,
                    yoyo: true,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        // Sparkle effect
                        this.spawnSparkles(this.charContainer.x, this.charContainer.y - 30);
                        resolve();
                    },
                });
            });
        }

        playInteractAnim() {
            return new Promise(resolve => {
                // Character nods/bobs
                this.tweens.add({
                    targets: this.charHead,
                    angle: { from: 0, to: -10 },
                    duration: 200,
                    yoyo: true,
                    repeat: 2,
                    onComplete: resolve,
                });
            });
        }

        spawnSparkles(x, y) {
            for (let i = 0; i < 8; i++) {
                const s = this.add.circle(x, y, 3, 0xfbbf24).setDepth(150);
                this.tweens.add({
                    targets: s,
                    x: x + Phaser.Math.Between(-40, 40),
                    y: y + Phaser.Math.Between(-40, 20),
                    alpha: 0,
                    scale: 0,
                    duration: 600,
                    ease: 'Sine.easeOut',
                    onComplete: () => s.destroy(),
                });
            }
        }

        // ── Error display ─────────────────────────────────────────────
        showError(title, description) {
            return new Promise(resolve => {
                // Screen shake
                this.cameras.main.shake(300, 0.01);

                // Red flash
                const flash = this.add.rectangle(VIEW_W / 2, H / 2, VIEW_W, H, 0xef4444, 0.3)
                    .setScrollFactor(0).setDepth(300);
                this.tweens.add({
                    targets: flash,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => flash.destroy(),
                });

                // Sad face
                this.charHead.setTexture('char-head-sad');

                // Error panel
                const panelBg = this.add.rectangle(VIEW_W / 2, H / 2, 400, 140, 0x1e293b, 0.95)
                    .setScrollFactor(0).setDepth(301).setStrokeStyle(3, 0xef4444);
                const panelTitle = this.add.text(VIEW_W / 2, H / 2 - 30, title, {
                    fontSize: '22px', fontFamily: 'Arial, sans-serif',
                    color: '#fca5a5', fontStyle: 'bold',
                }).setOrigin(0.5).setScrollFactor(0).setDepth(302);
                const panelDesc = this.add.text(VIEW_W / 2, H / 2 + 15, description, {
                    fontSize: '14px', fontFamily: 'Arial, sans-serif',
                    color: '#e2e8f0', wordWrap: { width: 360 },
                }).setOrigin(0.5).setScrollFactor(0).setDepth(302);

                // Fade out after delay
                this.time.delayedCall(3000, () => {
                    this.tweens.add({
                        targets: [panelBg, panelTitle, panelDesc],
                        alpha: 0,
                        duration: 500,
                        onComplete: () => {
                            panelBg.destroy();
                            panelTitle.destroy();
                            panelDesc.destroy();
                            resolve();
                        },
                    });
                });
            });
        }

        // ── Success display ───────────────────────────────────────────
        showSuccess() {
            return new Promise(resolve => {
                // Character jumps
                this.tweens.add({
                    targets: this.charContainer,
                    y: CHAR_GROUND - 40,
                    duration: 300,
                    yoyo: true,
                    ease: 'Sine.easeOut',
                });

                // Massive sparkle burst
                for (let i = 0; i < 20; i++) {
                    const c = [0xfbbf24, 0x22c55e, 0x60a5fa, 0xf472b6][i % 4];
                    const s = this.add.circle(
                        this.charContainer.x, this.charContainer.y - 40,
                        Phaser.Math.Between(2, 5), c
                    ).setDepth(150);
                    this.tweens.add({
                        targets: s,
                        x: this.charContainer.x + Phaser.Math.Between(-80, 80),
                        y: this.charContainer.y + Phaser.Math.Between(-80, 20),
                        alpha: 0,
                        duration: 1000,
                        ease: 'Sine.easeOut',
                        delay: i * 50,
                        onComplete: () => s.destroy(),
                    });
                }

                // Victory panel
                const panelBg = this.add.rectangle(VIEW_W / 2, H / 2, 420, 120, 0x0f172a, 0.95)
                    .setScrollFactor(0).setDepth(301).setStrokeStyle(3, 0x22c55e);
                const panelTitle = this.add.text(VIEW_W / 2, H / 2 - 20, 'MISSION COMPLETE!', {
                    fontSize: '26px', fontFamily: 'Arial, sans-serif',
                    color: '#6ee7b7', fontStyle: 'bold',
                }).setOrigin(0.5).setScrollFactor(0).setDepth(302);
                const panelDesc = this.add.text(VIEW_W / 2, H / 2 + 15, 'You successfully programmed the perfect morning routine!', {
                    fontSize: '14px', fontFamily: 'Arial, sans-serif',
                    color: '#e2e8f0',
                }).setOrigin(0.5).setScrollFactor(0).setDepth(302);

                this.time.delayedCall(4000, () => {
                    this.tweens.add({
                        targets: [panelBg, panelTitle, panelDesc],
                        alpha: 0,
                        duration: 500,
                        onComplete: () => {
                            panelBg.destroy();
                            panelTitle.destroy();
                            panelDesc.destroy();
                            resolve();
                        },
                    });
                });
            });
        }

        // ── Algorithm execution engine ────────────────────────────────
        async onExecute(steps) {
            if (state.executing) return;
            state.executing = true;

            const localState = {
                awake: false, brushed: false, eaten: false,
                socks: false, shoes: false, bag: false,
            };

            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                const target = STEP_TARGETS[step];
                if (!target) continue;

                // Show step label
                this.showStepLabel(`Step ${i + 1}: ${step}`);

                // ── Pre-validation ──
                if (step !== 'Wake up' && !localState.awake) {
                    await this.showError(
                        'STILL SLEEPING!',
                        `You tried to "${step}" while still asleep! You must wake up first.`
                    );
                    callbacks.onStatusChange('error');
                    callbacks.onMessage(`❌ Error at Step ${i + 1}: Tried to ${step.toLowerCase()} while asleep!`);
                    state.executing = false;
                    return;
                }

                if (step === 'Wear socks' && localState.shoes) {
                    await this.walkTo(target.x);
                    await this.showError(
                        'SOCKS OVER SHOES?!',
                        "You can't put socks on over your shoes! That makes no sense."
                    );
                    callbacks.onStatusChange('error');
                    callbacks.onMessage(`❌ Error at Step ${i + 1}: Can't put socks on over shoes!`);
                    state.executing = false;
                    return;
                }

                if (step === 'Wear shoes' && !localState.socks) {
                    await this.walkTo(target.x);
                    await this.showError(
                        'OUCH! BLISTERS!',
                        "You put shoes on without socks! That's going to cause painful blisters."
                    );
                    callbacks.onStatusChange('error');
                    callbacks.onMessage(`❌ Error at Step ${i + 1}: Forgot socks! Blisters detected.`);
                    state.executing = false;
                    return;
                }

                if (step === 'Leave home') {
                    if (!localState.shoes) {
                        await this.walkTo(target.x);
                        await this.showError(
                            'YOU ARE BAREFOOT!',
                            "You tried walking outside without shoes! Protect your feet."
                        );
                        callbacks.onStatusChange('error');
                        callbacks.onMessage(`❌ Error at Step ${i + 1}: Tried to walk outside barefoot!`);
                        state.executing = false;
                        return;
                    }
                    if (!localState.bag) {
                        await this.walkTo(target.x);
                        await this.showError(
                            'FORGOT YOUR BAG!',
                            "You can't go to school without your school bag!"
                        );
                        callbacks.onStatusChange('error');
                        callbacks.onMessage(`❌ Error at Step ${i + 1}: Left without school bag!`);
                        state.executing = false;
                        return;
                    }
                    if (!localState.eaten || !localState.brushed) {
                        await this.walkTo(target.x);
                        await this.showError(
                            'NOT READY!',
                            "You skipped eating or brushing! Complete your routine first."
                        );
                        callbacks.onStatusChange('error');
                        callbacks.onMessage(`❌ Error at Step ${i + 1}: Left without eating or brushing!`);
                        state.executing = false;
                        return;
                    }
                }

                // ── Highlight target object ──
                this.pulseHighlight(step);

                // ── Walk to target ──
                await this.walkTo(target.x);
                await this.wait(300);

                // ── Perform interaction ──
                if (step === 'Wake up') {
                    localState.awake = true;
                    state.awake = true;
                    this.charHead.setTexture('char-head');
                    if (this.zzzText) { this.zzzText.destroy(); this.zzzText = null; }
                    this.tweens.add({
                        targets: this.charContainer,
                        angle: 0,
                        x: 160,
                        y: CHAR_GROUND,
                        duration: 600,
                        ease: 'Back.easeOut'
                    });
                    await this.wait(600);
                    await this.playInteractAnim();
                    this.spawnSparkles(this.charContainer.x, this.charContainer.y - 50);
                }
                else if (step === 'Wear socks') {
                    localState.socks = true;
                    state.socks = true;
                    await this.playPickupAnim();
                    this.socksObj.setVisible(false);
                }
                else if (step === 'Pack bag') {
                    localState.bag = true;
                    state.bag = true;
                    await this.playPickupAnim();
                    this.bagObj.setVisible(false);
                    this.charBackpack.setVisible(true);
                    this.charStraps.setVisible(true);
                }
                else if (step === 'Brush teeth') {
                    localState.brushed = true;
                    state.brushed = true;
                    this.charHead.setTexture('char-head-brush');
                    this.charToothbrush.setVisible(true);
                    this.tweens.add({
                        targets: this.charToothbrush,
                        x: { from: 18, to: 25 },
                        duration: 100,
                        yoyo: true,
                        repeat: 8
                    });
                    await this.playInteractAnim();
                    await this.wait(500);
                    this.charToothbrush.setVisible(false);
                    this.charHead.setTexture('char-head');
                    this.spawnSparkles(this.charContainer.x + 10, this.charContainer.y - 60);
                }
                else if (step === 'Eat breakfast') {
                    localState.eaten = true;
                    state.eaten = true;
                    if (!localState.brushed) {
                        callbacks.onMessage("⚠️ Warning: Eating before brushing teeth!");
                    }
                    await this.playInteractAnim();
                    this.spawnSparkles(this.charContainer.x, this.charContainer.y - 40);
                }
                else if (step === 'Wear shoes') {
                    localState.shoes = true;
                    state.shoes = true;
                    await this.playPickupAnim();
                    this.charLeftFoot.setTexture('char-shoe');
                    this.charRightFoot.setTexture('char-shoe');
                    this.shoesObj.setVisible(false);
                }
                else if (step === 'Leave home') {
                    // Walk outside to school
                    await this.walkTo(2200);
                    await this.wait(500);
                }

                // Update HUD
                this.updateHUD();
                await this.wait(400);
            }

            // ── Final validation ──
            if (localState.shoes && localState.socks && localState.bag &&
                localState.eaten && localState.brushed && steps.includes('Leave home')) {
                await this.showSuccess();
                callbacks.onStatusChange('success');
                callbacks.onMessage('✅ Perfect! You successfully programmed the morning routine!');
            } else {
                if (!steps.includes('Leave home')) {
                    await this.showError(
                        'INCOMPLETE!',
                        "You never left home! Add 'Leave home' to your algorithm."
                    );
                } else {
                    await this.showError(
                        'MISSING STEPS!',
                        "Your algorithm is incomplete. Make sure to do everything before leaving."
                    );
                }
                callbacks.onStatusChange('error');
                callbacks.onMessage('❌ Algorithm incomplete. Debug your sequence and try again!');
            }

            state.executing = false;
        }

        // ── Reset ─────────────────────────────────────────────────────
        onReset() {
            this.scene.restart();
            Object.assign(state, {
                awake: false, brushed: false, eaten: false,
                socks: false, shoes: false, bag: false,
                executing: false,
            });
        }

        // ── Utility ───────────────────────────────────────────────────
        wait(ms) {
            return new Promise(r => this.time.delayedCall(ms, r));
        }
    }

    // ══════════════════════════════════════════════════════════════════
    //  GAME CONFIGURATION
    // ══════════════════════════════════════════════════════════════════
    const config = {
        type: Phaser.AUTO,
        width: VIEW_W,
        height: H,
        parent: container,
        backgroundColor: '#0f172a',
        scene: [BootScene, MainScene],
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        },
        render: {
            pixelArt: false,
            antialias: true,
        },
        resolution: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    };

    const game = new Phaser.Game(config);

    // ══════════════════════════════════════════════════════════════════
    //  PUBLIC API — called from React
    // ══════════════════════════════════════════════════════════════════
    return {
        executeAlgorithm(steps) {
            game.events.emit('execute-algorithm', steps);
        },
        reset() {
            game.events.emit('reset-game');
        },
        destroy() {
            game.destroy(true);
        },
    };
}
