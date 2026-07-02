'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from 'react';

interface IMessage {
    role:'assistant' | 'user';
    content?: string;
    document?: string;
}

const ChatComponent :React.FC = () => {
    const [message, setMessage] = React.useState<string>('');
    const [messages, setMessages] = React.useState<string[]>([]);

    const handleSendMessage = async() => {
        const res = await fetch('http://localhost:8000/chat?message=${message}');
        const data = await res.json();
        console.log({data});
     
    };

    return (
        <div className ="p-4">
            <div className="fixed bottom-4 w-100">
                <Input placeholder="Type your message." value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button onClick={(e) => {handleSendMessage(e)   
                }} disabled={!message.trim()}>Send</Button>
            </div>
        </div>
    );
};

export default ChatComponent;