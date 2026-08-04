import client from './client.mjs'

export async function getCompletion(prompt) {
    const ressponse = await client.chat.completions.create({
        model:process.env.DEEPSEEK_MODEL,
        messages:[
            { role:"user",content:prompt }
        ]
    })
    return ressponse.choices[0].message.content;
}

export async function getImage(prompt) {

}
