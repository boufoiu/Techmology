export type RequestMethod = 'get' | 'post' | 'patch' | 'delete' | 'put';

export type Options<
    T extends { query?: unknown; data?: unknown } = {
        query: unknown;
        data: unknown;
    }
> = Partial<{
    query: T['query'];
    data: T['data']; 
    headers: any; 
    files: unknown[];
    userAgentSuffix: string[];
    payloadJson: boolean;
    versioned: boolean;
    auth: boolean;
    reason: string;
}>;

export interface Request<
    T extends {
        response: Partial<{
            get: unknown;
            post: unknown;
            delete: unknown;
            patch: unknown;
            put: unknown;
        }>;
        options: Partial<{
            get: {
                query?: unknown;
                data?: unknown;
            };
            post: {
                query?: unknown;
                data?: unknown;
            };
            delete: {
                query?: unknown;
                data?: unknown;
            };
            patch: {
                query?: unknown;
                data?: unknown;
            };
            put: {
                query?: unknown;
                data?: unknown;
            };
        }>;
    }
> {
    get(options?: Options<T['options']['get'] & {}>): Promise<T['response']['get']>;
    post(options?: Options<T['options']['post'] & {}>): Promise<T['response']['post']>;
    delete(options?: Options<T['options']['delete'] & {}>): Promise<T['response']['delete']>;
    patch(options?: Options<T['options']['patch'] & {}>): Promise<T['response']['patch']>;
    put(options?: Options<T['options']['put'] & {}>): Promise<T['response']['put']>;
}

export type Response<T> = T | 'error';

export interface APIEndpoints {
    session: Request<{ response: { get: User }; options: never }>;
    new: {
        course: Request<{ response: { post: LessonMetaData }; options: { post: { data: PostCourseData } }}>;
        product: Request<{ response: { post: ProductMetaData }; options: { post: { data: PostProductData } } }>;
        makereply: Request<{ response: { post: null }; options: { post: { data: PostReply } } }>;
        subscribecourse: {
            (key: number): Request<{ response: { post: null }; options: never }>;
        };
        makepurchase: {
            (key: number): Request<{ response: { post: null }; options: never }>;
        };
        lesson: {
            (key: number): Request<{ response: {}; options: {} }>;
        };
    };
    showfilter: {
        Course: Request<{ response: { get: Courses }; options: { get: { query: CourseFilterQueryParameter } } }>;
        Product: Request<{ response: { get: Products }; options: { get: { query: ProductFilterQueryParameter } } }>;
    };
    lessons: {
        (key: number): Request<{ response: { get: LessonDataResponse }, options: never }>
    };
    createmeeting: Request<{ response: { get: CreateMeetingResponse }; options: never }>;
    login: Request<{ response: { get: { url: string } }; options: never }>;
    role: Request<{ response: { get: { role: number } }; options: never }>;
}

export interface User {
    Email: string;
    FirstName: string;
    LastName: string;
    PfP: string;
}

export interface PostLesson {
    data: Omit<LessonMetaData, "id" | "Peer_id">;
    ressources: Ressource[];
}

export interface Ressource {}

export interface PostReply {
    Lesson: string;
    Reply?: string;
    Content: string;
}

export interface Products {
    data: ProductMetaData[];
    images: { ID: number; data: Image[] }[];
}

export interface Product {
    data: ProductMetaData;
    images: Image[];
}

export interface PostProductData {
    data: Omit<ProductMetaData, "id">;
    images: Image[];
}

export interface ProductMetaData {
    id: number;
    Description: string;
    price: number;
}

export interface Courses {
    data: CourseMetaData[];
    images: { ID: number; data: Image[] }[];
}

export interface Course {
    data: CourseMetaData;
    images: Image[];
}

export interface PostCourseData {
    data: Omit<CourseMetaData, "id">;
    images: Image[];
}

export interface CourseMetaData {
    id: number;
    Title: string;
    Description: string;
    Language: string;
}

//To do
export interface Image {}

export interface LessonDataResponse {
    data: LessonMetaData;
    ressources: LessonRessource[];
}

export interface LessonMetaData {
    id: number;
    Title: string;
    Content: string;
    Peer_id: string;
}

export interface LessonRessource {
    ID: number;
    Data: string;
}

export interface CourseFilterQueryParameter {
    Language: string;
    Search: string;
}

export interface ProductFilterQueryParameter {
    MinPrice: number;
    MaxPrice: number;
}

export interface CreateMeetingResponse {
    uri: string;
    password: string;
}