import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
const POST = async (request: NextRequest) => {
    try {
        const inference = new HfInference("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");
        const chat = await inference.chatCompletion({
            model: "microsoft/Phi-3-mini-4k-instruct",
            messages: [{ role: "user", content: "Descripción del producto: poleras gymshark oversize de 'el mike' " }],
            max_tokens: 200,
        });
        return NextResponse.json({ descripcion: chat.choices[0].message.content });
    } catch (error: any) {

        console.log(error);
        return NextResponse.json({
            error: true,
            mensaje: 'Error al crear la imagen'
        });

    }


};

export { POST };
