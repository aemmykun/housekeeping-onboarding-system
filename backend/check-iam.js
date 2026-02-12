const { ResourceManagementClient } = require('@google-cloud/resource-manager');

async function checkIAM() {
    console.log("Checking for Google Cloud Credentials...");
    try {
        const client = new ResourceManagementClient();
        console.log("Attempting to list projects to verify credentials...");

        // This will attempt to use Application Default Credentials (ADC)
        const [projects] = await client.searchProjects();

        console.log("Successfully authenticated!");
        console.log(`Found ${projects.length} projects:`);
        projects.forEach(project => {
            console.log(`- ${project.displayName} (${project.projectId})`);
        });
    } catch (err) {
        console.error("IAM Check Failed!");
        console.error("Error Message:", err.message);
        console.log("\nPossible solutions:");
        console.log("1. Run 'gcloud auth application-default login' in your terminal.");
        console.log("2. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to your Service Account JSON path.");
    }
}

checkIAM();
