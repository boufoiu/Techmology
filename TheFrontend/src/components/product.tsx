import Image from 'next/image';
import Link from 'next/link';

import { ImageData, ProductMetaData, Products } from '@/lib/types';

export const ProductsView = ({ data, images }: Products) => (
    <div className="w-full h-min-[400px] mt-[40px] flex flex-col items-center">
        <div className="w-full flex justify-center">
            <h1 className="text-[24px] font-medium">Product List</h1>
        </div>
        <div className="w-[90%] h-ful inline-grid grid-cols-1 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-[30px] gap-[100px]">
            {data.map((product, index) => (
                <ProductItem key={index} {...product} images={images.filter((image) => image.ID === product.id)} />
            ))}
        </div>
    </div>
);

export type ProductItemProps = ProductMetaData & {
    images: ImageData[];
};

export const ProductItem = ({ id, Title, Description, Price, images }: ProductItemProps) => {
    const src =
        images.length === 0 ? '/illustrations/undraw-no-product-image.svg' : `data:image/png;base64,${images[0].Data}`;

    return (
        <Link href={`/products/${id}`}>
            <div className="w-[250px] h-[350px] shadow-xl flex flex-col items-center cursor-pointer rounded-md border-[1px] border-[#9ca3af]">
                <div className="w-[200px] h-[200px] overflow-hidden rounded-md mt-[20px]">
                    <Image
                        className="object-cover w-full h-full"
                        src={src}
                        width={200}
                        height={200}
                        alt="product-image"
                    />
                </div>
                <div className="pl-[25px] pr-[25px] w-full h-[80px] mt-[10px]">
                    <h1 className="font-medium text-[18px]">{Title}</h1>
                    <p className="mt-[5px]">{Description}</p>
                </div>
                <div className="w-full pl-[25px] pr-[25px] flex justify-end">
                    <p className="text-red-600">{Price} D.A</p>
                </div>
            </div>
        </Link>
    );
};

export const ProductDetails = ({ id, Title, Description, Price, images }: ProductItemProps) => (
    <>
        <div className="w-full h-[700px] flex justify-center items-center">
            <div className="w-[90%] max-w-[1000px] h-[90%] rounded-md border-[1px] border-[#9ca3af]">
                {Title}
            </div>
        </div>
    </>
);
