import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { Types } from "mongoose";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const { id } = await params;

    const prompts = await Prompt.find({ 
      creator: new Types.ObjectId(id)
    }).populate('creator', '-email');

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.log("error:", error);
    return new Response("Failed to fetch all thoughts", { status: 500 });
  }
};
