import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

// import { checkSubscription } from "@/lib/subscription";
// import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    // const freeTrial = await checkApiLimit();
    // const isPro = await checkSubscription();

    // if (!freeTrial && !isPro) {
    //   return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    // }

    const response = await replicate.run(
      "adirik/mvdream-multi-view:9a08902d9ffbf35b8e181b9c9adf54b5ed3e3acbb31c0a0022ee6b83fa85410a",
      {
        input: {
          prompt: prompt,
        },
      }
    );
    // if (!isPro) {
    //   await incrementApiLimit();
    // }

    return NextResponse.json(response);
  } catch (error) {
    console.log("[MODEL_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
