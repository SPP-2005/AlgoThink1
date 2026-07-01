const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\satya\\.gemini\\antigravity-ide\\brain\\edc55133-1777-48bd-ad8e-d14f420b149f';
const destDir = path.join(__dirname, 'public', 'assets', 'storybook');

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

// Find files matching prefixes
const files = fs.readdirSync(srcDir);
const getLatestFile = (prefix) => {
    const matched = files.filter(f => f.startsWith(prefix) && f.endsWith('.png'));
    // sort by timestamp (which is the end of the filename)
    matched.sort();
    return matched.length > 0 ? matched[matched.length - 1] : null;
};

const assets = [
    { prefix: 'bg_park', dest: 'bg_park.png' },
    { prefix: 'char_student', dest: 'char_student.png' },
    { prefix: 'prop_tent', dest: 'prop_tent.png' },
    { prefix: 'prop_truck', dest: 'prop_truck.png' },
    { prefix: 'prop_vols', dest: 'prop_vols.png' },
    { prefix: 'prop_crowd', dest: 'prop_crowd.png' }
];

assets.forEach(asset => {
    const srcFile = getLatestFile(asset.prefix);
    if (srcFile) {
        try {
            fs.copyFileSync(path.join(srcDir, srcFile), path.join(destDir, asset.dest));
            console.log(`✅ Successfully installed asset: ${asset.dest}`);
        } catch (err) {
            console.error(`❌ Failed to copy ${asset.dest}:`, err);
        }
    } else {
        console.error(`⚠️ Could not find generated asset for prefix: ${asset.prefix}`);
    }
});
console.log("\n🎉 All Storybook assets are installed! You can now run the simulation.");
