import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    //todos in the body of the POST
    const {todos}= await request.json();
    console.log(todos);

    // communication with openAI GPT
try{

    const response = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
        n:1,
        messages:[
            {
                "role":'system',
                "content":"When responding , welcome the user always as Mr.Sonny and Welcome to Personal Todo App! Limit the response to 200 characters",
            },
            {
                "role":'user',
                "content":`Hi there , provide a summery of the following todos . 
                Count how many todos are in each category such as To do , in progress and done ,  
                then tell the user to have a productive day here is the data`,
            }
        ],
        stream:false,
    })
    const data = response;
    console.log("Data is: " , data.choices[0].message);
    return NextResponse.json(data.choices[0].message);
}catch(error){

    console.error("Error in OpenAI API request:", error);
    return NextResponse.error();
}
}