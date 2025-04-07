const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Sample size mapping data (in a real app, this would come from a database)
const sizeMapping = {
    male: {
        XS: { height: [160, 170], weight: [50, 60], chest: [80, 90], waist: [70, 80], hips: [85, 95] },
        S: { height: [165, 175], weight: [55, 65], chest: [85, 95], waist: [75, 85], hips: [90, 100] },
        M: { height: [170, 180], weight: [60, 70], chest: [90, 100], waist: [80, 90], hips: [95, 105] },
        L: { height: [175, 185], weight: [65, 75], chest: [95, 105], waist: [85, 95], hips: [100, 110] },
        XL: { height: [180, 190], weight: [70, 80], chest: [100, 110], waist: [90, 100], hips: [105, 115] }
    },
    female: {
        XS: { height: [150, 160], weight: [45, 55], chest: [75, 85], waist: [60, 70], hips: [80, 90] },
        S: { height: [155, 165], weight: [50, 60], chest: [80, 90], waist: [65, 75], hips: [85, 95] },
        M: { height: [160, 170], weight: [55, 65], chest: [85, 95], waist: [70, 80], hips: [90, 100] },
        L: { height: [165, 175], weight: [60, 70], chest: [90, 100], waist: [75, 85], hips: [95, 105] },
        XL: { height: [170, 180], weight: [65, 75], chest: [95, 105], waist: [80, 90], hips: [100, 110] }
    }
};

// Custom size prediction function
function predictSize(measurements, gender) {
    const { height, weight, chest, waist, hips } = measurements;
    
    // Handle "other" gender by using average of male and female measurements
    let sizes;
    if (gender === 'other') {
        // Create a combined size mapping for "other" gender
        sizes = {};
        const maleSizes = sizeMapping.male;
        const femaleSizes = sizeMapping.female;
        
        // For each size (XS, S, M, L, XL), calculate the average ranges
        Object.keys(maleSizes).forEach(size => {
            const maleRange = maleSizes[size];
            const femaleRange = femaleSizes[size];
            
            sizes[size] = {
                height: [
                    (maleRange.height[0] + femaleRange.height[0]) / 2,
                    (maleRange.height[1] + femaleRange.height[1]) / 2
                ],
                weight: [
                    (maleRange.weight[0] + femaleRange.weight[0]) / 2,
                    (maleRange.weight[1] + femaleRange.weight[1]) / 2
                ],
                chest: [
                    (maleRange.chest[0] + femaleRange.chest[0]) / 2,
                    (maleRange.chest[1] + femaleRange.chest[1]) / 2
                ],
                waist: [
                    (maleRange.waist[0] + femaleRange.waist[0]) / 2,
                    (maleRange.waist[1] + femaleRange.waist[1]) / 2
                ],
                hips: [
                    (maleRange.hips[0] + femaleRange.hips[0]) / 2,
                    (maleRange.hips[1] + femaleRange.hips[1]) / 2
                ]
            };
        });
    } else {
        sizes = sizeMapping[gender];
    }
    
    // Calculate score for each size based on how well measurements fit within ranges
    const sizeScores = Object.entries(sizes).map(([size, ranges]) => {
        let score = 0;
        
        // Check if height is within range
        if (height >= ranges.height[0] && height <= ranges.height[1]) score += 1;
        
        // Check if weight is within range
        if (weight >= ranges.weight[0] && weight <= ranges.weight[1]) score += 1;
        
        // Check if chest is within range
        if (chest >= ranges.chest[0] && chest <= ranges.chest[1]) score += 1;
        
        // Check if waist is within range
        if (waist >= ranges.waist[0] && waist <= ranges.waist[1]) score += 1;
        
        // Check if hips is within range
        if (hips >= ranges.hips[0] && hips <= ranges.hips[1]) score += 1;
        
        return { size, score };
    });
    
    // Sort sizes by score in descending order
    sizeScores.sort((a, b) => b.score - a.score);
    
    // Calculate confidence based on how many measurements fit within the range
    const confidence = sizeScores[0].score / 5;
    
    return {
        predictedSize: sizeScores[0].size,
        confidence: confidence
    };
}

// API endpoint for size prediction
app.post('/api/predict-size', (req, res) => {
    try {
        const { height, weight, chest, waist, hips, gender } = req.body;
        
        // Validate input
        if (!height || !weight || !chest || !waist || !hips || !gender) {
            return res.status(400).json({ error: 'All measurements and gender are required' });
        }
        
        if (gender !== 'male' && gender !== 'female' && gender !== 'other') {
            return res.status(400).json({ error: 'Gender must be either male, female, or other' });
        }
        
        // Get prediction using custom function
        const { predictedSize, confidence } = predictSize({ height, weight, chest, waist, hips }, gender);
        
        // Get size comparison data
        const sizeComparison = getSizeComparison(predictedSize, gender);
        
        // Get fit description
        const fitDescription = getFitDescription(predictedSize);
        
        // Return prediction results
        res.json({
            predicted_size: predictedSize,
            confidence: confidence,
            size_comparison: sizeComparison,
            fit_description: fitDescription
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// Helper function to get size comparison data
function getSizeComparison(size, gender) {
    // For "other" gender, use a combination of male and female sizes
    let sizes;
    if (gender === 'other') {
        sizes = Object.keys(sizeMapping.male);
    } else {
        sizes = Object.keys(sizeMapping[gender]);
    }
    
    const sizeIndex = sizes.indexOf(size);
    
    return sizes.map((s, index) => {
        let fit = 'Standard';
        if (index < sizeIndex) fit = 'Smaller';
        if (index > sizeIndex) fit = 'Larger';
        
        return {
            brand: `Brand ${sizes.length - Math.abs(index - sizeIndex)}`,
            size: s,
            fit: fit
        };
    });
}

// Helper function to get fit description
function getFitDescription(size) {
    const descriptions = {
        XS: 'Extra Small - Fitted and snug',
        S: 'Small - Slightly fitted',
        M: 'Medium - Standard fit',
        L: 'Large - Relaxed fit',
        XL: 'Extra Large - Loose fit'
    };
    
    return descriptions[size] || 'Standard fit';
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 