import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

// Get (read)
export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const prompt = await Prompt.findById(params.id).populate("creator", "-email")
        if (!prompt) return new Response("Thought Not Found", { status: 404 });

        return new Response(JSON.stringify(prompt), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

// PATCH — return JSON, not plain text
export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json();
  try {
    await connectToDB();
    const existingPrompt = await Prompt.findById(params.id);
    if (!existingPrompt) return new Response("Thought not found", { status: 404 });

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;
    await existingPrompt.save();


    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response("Error Updating Thought", { status: 500 });
  }
};

// DELETE 
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();
    await Prompt.findByIdAndDelete(params.id);
    return new Response("Thought deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting Thought", { status: 500 });
  }
};