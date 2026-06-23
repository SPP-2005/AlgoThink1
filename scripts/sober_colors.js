const fs = require('fs');
const path = require('path');

const dir = 'e:/AlgoThink1/app';

const colorMap = {
    // Neon Pink -> Sober Blue
    '#f472b6': '#60a5fa',
    '#ec4899': '#3b82f6',
    'rgba(236, 72, 153, 0.1)': 'rgba(59, 130, 246, 0.15)',
    
    // Neon Purple -> Sober Indigo
    '#c084fc': '#818cf8',
    '#8b5cf6': '#6366f1',
    'rgba(139, 92, 246, 0.1)': 'rgba(99, 102, 241, 0.15)',
    
    // Neon Cyan -> Sober Teal
    '#7dd3fc': '#5eead4',
    '#38bdf8': '#14b8a6',
    'rgba(56, 189, 248, 0.1)': 'rgba(20, 184, 166, 0.15)',
    
    // Neon Orange -> Sober Amber
    '#fdba74': '#fcd34d',
    '#fb923c': '#d97706',
    '#f59e0b': '#b45309',
    'rgba(251, 146, 60, 0.1)': 'rgba(217, 119, 6, 0.15)',
    'rgba(245, 158, 11, 0.1)': 'rgba(180, 83, 9, 0.15)',

    // Neon Green -> Sober Emerald
    '#34d399': '#34d399',
    '#10b981': '#059669',
    'rgba(16, 185, 129, 0.1)': 'rgba(5, 150, 105, 0.15)',

    // Bright Red -> Sober Rose
    '#ef4444': '#e11d48',
    'rgba(239, 68, 68, 0.1)': 'rgba(225, 29, 72, 0.15)'
};

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            for (const [bright, sober] of Object.entries(colorMap)) {
                if (content.includes(bright)) {
                    content = content.split(bright).join(sober);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated ' + fullPath);
            }
        }
    }
}

processDirectory(dir);
