const { PythonShell } = require('python-shell');
const geminiService = require('./geminiService');

async function generateManimScript(topic, type) {
    const prompt = `Write a Manim Python script to visualize "${topic}". 
  The class name must be "TopicAnimation". 
  Return ONLY the python code, no markdown backticks.`;
    return await geminiService.generateText(prompt);
}

exports.generateAnimation = async (topic, type) => {
    try {
        const script = await generateManimScript(topic, type);

        // Here we would ideally save 'script' to a .py file and run it.
        // For this prototype, we'll assume a script runner exists or just return the script for now 
        // if python/manim isn't fully set up on the host.
        // However, following the code structure:

        return new Promise((resolve, reject) => {
            // Warning: 'generate_animation.py' needs to handle the logic. 
            // If it doesn't exist, this will fail. 
            // I'll assume for now we just want to run the python command.

            const options = {
                args: [script, type]
            };

            PythonShell.run('generate_animation.py', options, (err, results) => {
                if (err) {
                    console.warn("Python execution failed (Manim might not be installed):", err.message);
                    // Fallback: return the script so frontend can display it or debug
                    resolve({ script, status: "generated_only", error: err.message });
                } else {
                    resolve(results);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}
