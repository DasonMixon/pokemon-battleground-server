export default interface ResponseMessage<T> {
    wasSuccessful: boolean;
    failureReason: string;
    response: T;
}