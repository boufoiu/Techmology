import { Copyright, FooterItems } from '@/constants';

export interface FooterSectionProps {
    title: string;
    items: {
        name: string;
        href: string;
    }[];
}

export const Footer = () => (
    <footer className="absolute bottom-[-650px] w-full h-[600px] sm:h-96 mt-32 flex flex-col justify-center items-center text-white bg-[#3B69B1]">
        <div className="w-full h-[80%] sm:h-[70%] flex justify-around flex-col items-center sm:flex-row">
            {FooterItems.map((item, index) => (
                <FooterSection key={index} {...item} />
            ))}
        </div>
        <div className="w-full flex justify-center mt-[10px]">
            <div className="w-[90%] text-center">{Copyright}</div>
        </div>
    </footer>
);

export const FooterSection = ({ title, items }: FooterSectionProps) => (
    <div className="w-[200px] sm:h-full flex flex-col mt-[10px] sm:mt-[0px] items-center sm:items-start">
        <p className="font-bold text-[18px] mb-[5px] sm:mb-[20px]">{title}</p>
        {items.map(({ name, href }, index) => (
            <a key={index} href={href} className="mb-[5px]">
                {name}
            </a>
        ))}
    </div>
);
