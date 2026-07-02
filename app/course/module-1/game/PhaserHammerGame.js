export function createHammerGame(Phaser, container, callbacks) {
    const W = 960;
    const H = 480;
    const FLOOR_Y = 380;
    const CHAR_GROUND = FLOOR_Y - 8;

    const state = {
        executing: false,
    };

    class BootScene extends Phaser.Scene {
        constructor() { super('boot'); }
        create() {
            this.generateTextures();
            this.scene.start('main');
        }

        generateTextures() {
            const S = 4;
            const makeTex = (g, key, w, h) => {
                g.scaleX = S; g.scaleY = S;
                g.generateTexture(key, w * S, h * S);
                g.destroy();
            };

            // Character head
            let g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x3b1a06); g.fillCircle(24, 18, 22);
            g.fillStyle(0xf5c882); g.fillCircle(24, 22, 18);
            g.fillStyle(0x3b1a06); g.fillRoundedRect(4, 0, 40, 16, 10);
            g.fillStyle(0x1a1a2e); g.fillCircle(16, 22, 3.5); g.fillCircle(32, 22, 3.5);
            g.fillStyle(0xffffff); g.fillCircle(17, 21, 1.3); g.fillCircle(33, 21, 1.3);
            g.lineStyle(2, 0x1a1a2e, 1);
            g.beginPath(); g.arc(24, 27, 5, Phaser.Math.DegToRad(10), Phaser.Math.DegToRad(170), false); g.strokePath();
            g.fillStyle(0xf5a0a0, 0.35); g.fillCircle(9, 28, 4); g.fillCircle(39, 28, 4);
            makeTex(g, 'char-head', 48, 48);

            // Sad head
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x3b1a06); g.fillCircle(24, 18, 22);
            g.fillStyle(0xf5c882); g.fillCircle(24, 22, 18);
            g.fillStyle(0x3b1a06); g.fillRoundedRect(4, 0, 40, 16, 10);
            g.fillStyle(0x1a1a2e); g.fillCircle(16, 22, 3.5); g.fillCircle(32, 22, 3.5);
            g.fillStyle(0xffffff); g.fillCircle(17, 21, 1.3); g.fillCircle(33, 21, 1.3);
            g.lineStyle(2, 0x1a1a2e, 1);
            g.beginPath(); g.arc(24, 34, 5, Phaser.Math.DegToRad(190), Phaser.Math.DegToRad(350), false); g.strokePath();
            makeTex(g, 'char-head-sad', 48, 48);

            // Character torso with neck
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0xf5c882); g.fillRect(10, 0, 12, 8);
            g.fillStyle(0x3b82f6); g.fillRoundedRect(0, 6, 32, 34, 6);
            g.fillStyle(0xe8e8e8); g.fillTriangle(10, 6, 22, 6, 16, 16);
            g.fillStyle(0xe8e8e8); g.fillCircle(16, 22, 2); g.fillCircle(16, 30, 2);
            makeTex(g, 'char-body', 32, 40);

            // Arm
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x2563eb); g.fillRoundedRect(0, 0, 10, 26, 4);
            g.fillStyle(0xf5c882); g.fillCircle(5, 28, 5);
            makeTex(g, 'char-arm', 12, 34);

            // Leg
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x334155); g.fillRoundedRect(0, 0, 12, 28, 3);
            makeTex(g, 'char-leg', 12, 28);

            // Shoe
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0xdc2626); g.fillRoundedRect(0, 0, 16, 10, 4);
            makeTex(g, 'char-shoe', 16, 10);

            // Hammer
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0xfcd34d); g.fillRoundedRect(16, 16, 8, 40, 4);
            g.fillStyle(0x475569); g.fillRoundedRect(0, 0, 40, 20, 4);
            g.fillStyle(0x334155); g.fillRoundedRect(35, 4, 10, 12, 2);
            makeTex(g, 'hammer', 45, 60);

            // Wood Block
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0xb45309); g.fillRoundedRect(0, 0, 140, 70, 4);
            g.lineStyle(4, 0x78350f); g.strokeRoundedRect(2, 2, 136, 66, 4);
            makeTex(g, 'wood-block', 140, 70);

            // Nail
            g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(0x94a3b8); g.fillRect(10, 8, 10, 70);
            g.fillStyle(0x64748b); g.fillRoundedRect(0, 0, 30, 8, 2);
            makeTex(g, 'nail', 30, 78);
        }
    }

    class MainScene extends Phaser.Scene {
        constructor() { super('main'); }

        create() {
            // Draw Workshop Background (Lighter warm/bright colors)
            const bg = this.add.graphics();
            bg.fillGradientStyle(0xe0f2fe, 0xe0f2fe, 0xbae6fd, 0xbae6fd, 1);
            bg.fillRect(0, 0, W, H);

            // Draw floor
            bg.fillStyle(0x94a3b8);
            bg.fillRect(0, FLOOR_Y, W, H - FLOOR_Y);

            // Draw Table
            const tableY = FLOOR_Y - 45; // slightly lower
            bg.fillStyle(0x8b5cf6);
            bg.fillRect(W / 2 - 80, tableY, 160, 20); // Thicker Table top to hide the nail
            bg.fillStyle(0x7c3aed);
            bg.fillRect(W / 2 - 60, tableY + 20, 15, 25); // Left leg
            bg.fillRect(W / 2 + 45, tableY + 20, 15, 25); // Right leg

            // Wood block on table (origin bottom center)
            // Scale 0.25 -> Height = 17.5px
            this.woodBlock = this.add.sprite(W / 2, tableY, 'wood-block').setOrigin(0.5, 1).setScale(0.25);

            // Nail (origin bottom center, starting significantly higher above the wood block)
            // Scale X=0.15 (thin), Y=0.25 (balanced height) -> Height = 19.5px
            this.nailStart = tableY - 25; // Starts 7.5px higher than the wood block top
            this.nail = this.add.sprite(W / 2, this.nailStart, 'nail').setOrigin(0.5, 1).setScale(0.15, 0.25);

            // Hammer on table (to be picked up)
            this.tableHammer = this.add.sprite(W / 2 + 50, tableY - 5, 'hammer').setOrigin(0.5, 0.5).setAngle(90).setScale(0.18);

            // Character
            this.createCharacter(W / 2 - 90, CHAR_GROUND);

            // Game State
            this.nailDepth = 0;
            this.hasHammer = false;

            // Events
            this.game.events.on('execute-hammer', (steps) => {
                this.onExecute(steps);
            });
            this.game.events.on('reset-hammer', () => {
                this.onReset();
            });
        }

        createCharacter(x, y) {
            // Make the boy bigger!
            this.charContainer = this.add.container(x, y).setScale(1.8);

            // Shadow
            const shadow = this.add.graphics();
            shadow.fillStyle(0x000000, 0.2);
            shadow.fillEllipse(0, 5, 40, 12);

            // Legs & Feet
            this.charLeftLeg = this.add.sprite(-6, -5, 'char-leg').setOrigin(0.5, 0).setScale(0.25);
            this.charRightLeg = this.add.sprite(6, -5, 'char-leg').setOrigin(0.5, 0).setScale(0.25);
            this.charLeftFoot = this.add.sprite(-6, 22, 'char-shoe').setOrigin(0.5, 0).setScale(0.25);
            this.charRightFoot = this.add.sprite(6, 22, 'char-shoe').setOrigin(0.5, 0).setScale(0.25);

            // Body
            this.charBody = this.add.sprite(0, -40, 'char-body').setOrigin(0.5, 0).setScale(0.25);

            // Arms
            this.charLeftArm = this.add.sprite(-18, -38, 'char-arm').setOrigin(0.5, 0).setScale(0.25);
            this.charRightArm = this.add.container(18, -38);
            const rArmSprite = this.add.sprite(0, 0, 'char-arm').setOrigin(0.5, 0).setScale(0.25);
            this.charRightArm.add(rArmSprite);

            // Hammer in hand
            // Angled so the head points outward instead of hitting with the handle!
            this.charHammer = this.add.sprite(5, 30, 'hammer').setOrigin(0.5, 0.5).setAngle(80).setVisible(false).setScale(0.25);
            this.charRightArm.add(this.charHammer);

            // Head
            this.charHead = this.add.sprite(0, -56, 'char-head').setOrigin(0.5, 0.5).setScale(0.25);

            this.charContainer.add([
                shadow,
                this.charLeftLeg, this.charRightLeg,
                this.charLeftFoot, this.charRightFoot,
                this.charBody,
                this.charLeftArm,
                this.charHead,
                this.charRightArm, // Right arm on top
            ]);
        }

        async playHitAnim(isSuccess) {
            return new Promise(resolve => {
                // 1. Raise arm
                this.tweens.add({
                    targets: this.charRightArm,
                    angle: -110,
                    duration: 150,
                    ease: 'Power2',
                    onComplete: () => {
                        // 2. Swing down
                        this.tweens.add({
                            targets: this.charRightArm,
                            angle: -10, // Impact angle
                            duration: 80,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                // Impact moment
                                if (isSuccess && this.nailDepth < 100) {
                                    this.nailDepth += 10;

                                    // Map logical depth (0-100) to visual depth (0 to 27px)
                                    // At depth 100, visual depth is 27, making the nail travel 27px to become perfectly flush!
                                    const visualDepth = this.nailDepth * 0.27;
                                    this.nail.setY(this.nailStart + visualDepth);

                                    // Splinters/Particles
                                    this.spawnSparkles(this.nail.x, this.nail.y - 12);

                                    // Vibrate the wood block
                                    this.tweens.add({
                                        targets: this.woodBlock,
                                        y: this.woodBlock.y + 2,
                                        duration: 30,
                                        yoyo: true,
                                        repeat: 1
                                    });
                                } else if (!this.hasHammer || this.nailDepth >= 100) {
                                    // Error impact
                                    this.cameras.main.shake(300, 0.015);
                                    this.charHead.setTexture('char-head-sad');
                                }

                                // 3. Return to resting
                                this.tweens.add({
                                    targets: this.charRightArm,
                                    angle: -40,
                                    duration: 120,
                                    ease: 'Power1',
                                    onComplete: resolve
                                });
                            }
                        });
                    }
                });
            });
        }

        spawnSparkles(x, y) {
            for (let i = 0; i < 6; i++) {
                // Use wood/dust colors instead of gold sparkles
                const colors = [0xd97706, 0xb45309, 0x78350f, 0x92400e];
                const s = this.add.circle(x, y, 3, Phaser.Utils.Array.GetRandom(colors));
                this.tweens.add({
                    targets: s,
                    x: x + Phaser.Math.Between(-25, 25),
                    y: y + Phaser.Math.Between(-30, -5),
                    alpha: 0,
                    scale: 0.1,
                    duration: 500,
                    ease: 'Sine.easeOut',
                    onComplete: () => s.destroy()
                });
            }
        }

        async showError(title, msg) {
            this.cameras.main.shake(400, 0.02);
            this.charHead.setTexture('char-head-sad');

            const panelBg = this.add.rectangle(W / 2, H / 2, 400, 140, 0x0f172a, 0.95)
                .setStrokeStyle(3, 0xef4444).setDepth(300);

            const panelTitle = this.add.text(W / 2, H / 2 - 25, title, {
                fontSize: '24px', fontFamily: 'Arial', color: '#fca5a5', fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(301);

            const panelDesc = this.add.text(W / 2, H / 2 + 15, msg, {
                fontSize: '14px', fontFamily: 'Arial', color: '#e2e8f0',
                align: 'center', wordWrap: { width: 360 }
            }).setOrigin(0.5).setDepth(301);

            await this.wait(3500);

            this.tweens.add({
                targets: [panelBg, panelTitle, panelDesc],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    panelBg.destroy(); panelTitle.destroy(); panelDesc.destroy();
                }
            });
        }

        async showSuccess() {
            this.tweens.add({
                targets: this.charContainer,
                y: this.charContainer.y - 40,
                duration: 250,
                yoyo: true,
                repeat: 3,
                ease: 'Sine.easeInOut'
            });

            // Confetti
            for (let i = 0; i < 60; i++) {
                const colors = [0x34d399, 0xfcd34d, 0x60a5fa, 0xa78bfa];
                const s = this.add.rectangle(
                    this.charContainer.x + Phaser.Math.Between(-60, 60),
                    this.charContainer.y - 40 + Phaser.Math.Between(-60, 20),
                    8, 8, Phaser.Utils.Array.GetRandom(colors)
                );
                this.tweens.add({
                    targets: s,
                    x: this.charContainer.x + Phaser.Math.Between(-150, 150),
                    y: this.charContainer.y + Phaser.Math.Between(0, 100),
                    angle: Phaser.Math.Between(-360, 360),
                    alpha: 0,
                    duration: 1500 + Phaser.Math.Between(0, 1000),
                    ease: 'Sine.easeOut',
                    delay: i * 20,
                    onComplete: () => s.destroy(),
                });
            }
        }

        async onExecute(steps) {
            if (state.executing) return;
            state.executing = true;

            for (let i = 0; i < steps.length; i++) {
                const action = steps[i];
                if (action === 'Pick up hammer') {
                    this.hasHammer = true;
                    this.charHammer.setVisible(true);
                    if (this.tableHammer) {
                        this.tableHammer.setVisible(false);
                    }
                    this.tweens.add({
                        targets: this.charRightArm,
                        angle: -40,
                        duration: 300,
                        ease: 'Back.easeOut'
                    });
                    await this.wait(600);
                } else if (action === 'Hit nail') {
                    if (!this.hasHammer) {
                        await this.playHitAnim(false);
                        await this.showError('OUCH! BARE HAND!', "You tried to hit the nail with your bare hand! Always pick up the right tool first.");
                        callbacks.onStatusChange('error');
                        callbacks.onMessage(`❌ Crash at Step ${i + 1}: Tried to hit the nail with bare hand!`);
                        state.executing = false;
                        return;
                    }

                    await this.playHitAnim(true);

                    if (this.nailDepth > 100) {
                        await this.showError('WOOD DESTROYED!', "You hit it too many times and damaged the wood! A loop helps prevent over-hitting.");
                        callbacks.onStatusChange('error');
                        callbacks.onMessage(`❌ Crash at Step ${i + 1}: You hit the wood! (Iteration required)`);
                        state.executing = false;
                        return;
                    }
                    await this.wait(400);
                } else if (action === 'Loop: [Hit nail] until flush') {
                    if (!this.hasHammer) {
                        await this.showError('CANNOT LOOP!', "You can't loop a hammer hit without holding a hammer!");
                        callbacks.onStatusChange('error');
                        callbacks.onMessage(`❌ Crash at Step ${i + 1}: Can't loop without a hammer!`);
                        state.executing = false;
                        return;
                    }

                    while (this.nailDepth < 100) {
                        await this.playHitAnim(true);
                        await this.wait(200);
                    }
                    await this.wait(400);
                }
            }

            // Validation
            if (this.nailDepth === 100) {
                await this.showSuccess();
                if (steps.filter(x => x === 'Hit nail').length > 1) {
                    callbacks.onStatusChange('warning');
                    callbacks.onMessage("⚠️ Task Completed, but you repeated the 'Hit nail' step manually! Don't repeat yourself—use a Loop next time.");
                } else if (steps.includes('Loop: [Hit nail] until flush')) {
                    callbacks.onStatusChange('success');
                    callbacks.onMessage("✅ Perfect! You used a Loop to avoid repeating steps, and Iterated to find the perfect algorithm!");
                } else {
                    callbacks.onStatusChange('success');
                    callbacks.onMessage("✅ Done! But try using a loop next time.");
                }
            } else {
                await this.showError('NAIL NOT FLUSH!', "The nail is still sticking out! You didn't repeat the action enough times.");
                callbacks.onStatusChange('error');
                callbacks.onMessage("❌ Simulation ended, but the nail isn't flush! Iteration is key.");
            }

            state.executing = false;
        }

        onReset() {
            this.scene.restart();
            state.executing = false;
        }

        wait(ms) {
            return new Promise(r => this.time.delayedCall(ms, r));
        }
    }

    const config = {
        type: Phaser.AUTO,
        width: W,
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

    return {
        executeAlgorithm(steps) {
            game.events.emit('execute-hammer', steps);
        },
        reset() {
            game.events.emit('reset-hammer');
        },
        destroy() {
            game.destroy(true);
        },
    };
}
