import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { Types } from "mongoose";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({ 
      creator: new Types.ObjectId(params.id)
    }).populate('creator', '-email');

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all thoughts", { status: 500 });
  }
};
