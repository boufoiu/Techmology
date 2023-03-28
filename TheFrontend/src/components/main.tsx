import Image from 'next/image';

import { BenifitItems } from '@/constants';

export interface CardProps {
    title: string;
    description: string;
    imageUrl: string;
}

export const Body = () => (
    <>
        <div className="w-full h-[350px] flex justify-center items-center">
            <div className="w-[90%] flex justify-center">
                <div className="text-4xl sm:text-5xl font-bold">
                    Learn <span className="text-[#E83C35]">cool</span> stuff right away! <br />
                    Focus on the <span className="text-[#3B69B1]">essentials</span> only
                </div>
            </div>
        </div>

        <div className="flex flex-col items-center">
            <div className="font-medium text-4xl mb-8">
                <p>Main benifits</p>
            </div>
            <div className="w-full h-3/5 pl-[10px] pr-[10px] flex flex-col items-center gap-[40px] md:flex-row justify-around">
                {BenifitItems.map((item, index) => (
                    <Card key={index} {...item} />
                ))}
            </div>
        </div>
    </>
);

export function Card({ title, description, imageUrl }: CardProps) {
    return (
        <div className="w-[280px] h-96 shadow hover:shadow-lg rounded-md flex flex-col items-center justify-around">
            <Image src={imageUrl} width={250} height={250} alt="foo" />
            <p className="font-medium text-lg">{title}</p>
            <p className="text-center">{description}</p>
        </div>
    );
}
