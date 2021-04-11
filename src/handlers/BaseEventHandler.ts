import socketio from 'socket.io';
import ResponseMessage from './../models/ResponseMessage';
import logger from './../logging/logger';

const registerHandler = <TRequestMessage, TResponseMessage>(
    socket: socketio.Socket,
    event: string,
    fn: (
        data: TRequestMessage,
        success: (response: TResponseMessage) => ResponseMessage<TResponseMessage>,
        failure: (failureReason: string) => ResponseMessage<TResponseMessage>
    ) => ResponseMessage<TResponseMessage>) => {
    socket.on(event, (data: TRequestMessage, callback: any) => {
        try {
            const result = fn(data, success, failure);

            if (callback !== undefined)
                callback(result);
        } catch (err) {
            logger.error(err);

            const result: ResponseMessage<TResponseMessage> = {
                wasSuccessful: false,
                failureReason: err,
                response: null
            };
            
            if (callback !== undefined)
                callback(result);
        }
    });

    const success = (response: TResponseMessage): ResponseMessage<TResponseMessage> => {
        return {
            wasSuccessful: true,
            failureReason: null,
            response
        }
    }
    
    const failure = (failureReason: string): ResponseMessage<TResponseMessage> => {
        return {
            wasSuccessful: false,
            failureReason,
            response: null
        }
    }
}

export { registerHandler };