const { PythonShell } = require('python-shell');
const geminiService = require('./geminiService');
const { spawnSync } = require('child_process');

async function generateManimScript(topic, type) {
    const prompt = `Write a Manim Python script to visualize "${topic}". 
  The class name must be "TopicAnimation". 
  Return ONLY the python code, no markdown backticks.`;
    return await geminiService.generateText(prompt);
}

exports.generateAnimation = async (topic, type) => {
    try {
        const script = await generateManimScript(topic, type);

        // Check if Python is available to avoid crash
        const pythonCheck = spawnSync('python', ['--version']);
        if (pythonCheck.error) {
            console.log("Python not found. Returning script only.");
            return { script, status: "script_generated_only", message: "Python not found on server. Animation script generated but not rendered." };
        }

        return new Promise((resolve, reject) => {
            const options = {
                args: [script, type]
            };

            // Wrap in try-catch for synchronous failures in PythonShell
            try {
                const pyShell = new PythonShell('generate_animation.py', options);

                // Collect results
                let results = [];
                pyShell.on('message', function (message) {
                    results.push(message);
                });

                // Handle error specifically
                pyShell.on('error', function (err) {
                    console.warn("Python Shell handled error:", err.message);
                    resolve({ script, status: "script_generated_only", error: err.message });
                });

                pyShell.end(function (err, code, signal) {
                    if (err) {
                        console.warn("Python Shell ended with error:", err.message);
                        resolve({ script, status: "script_generated_only", error: err.message });
                    } else {
                        resolve(results);
                    }
                });

            } catch (e) {
                console.error("PythonShell Instantiation Error:", e);
                resolve({ script, status: "script_generated_only", error: e.message });
            }
        });
    } catch (error) {
        throw error;
    }
}
