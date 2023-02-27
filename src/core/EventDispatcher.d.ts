export interface BaseEvent {
    type: string;
}

/**
 * Event object.
 */
export class Event implements BaseEvent {
    /**
     * Creates event object.
     **/
    constructor(eventData: { type: string } & { [prop: string]: any }, options?: EventOptions);

    type: string;
    target?: any;
    private path: Array<EventDispatcher> | null;
    [attachment: string]: any;
    stopQueue: () => void;
    stopBubbling: () => void;
}

export interface EventOptions {
    bubbles?: boolean;
}

export interface EventListenerOptions {
    priority?: number;
}

export type EventListener<E, T, U> = (event: E & { type: T } & { target: U }) => void;

/**
 * JavaScript events for custom objects
 *
 * @source src/core/EventDispatcher.js
 */
export class EventDispatcher<E extends BaseEvent = Event> {
    /**
     * Creates eventDispatcher object. It needs to be call with '.call' to add the functionality to an object.
     */
    constructor();

    /**
     * Adds a listener to an event type.
     * @param type The type of event to listen to.
     * @param listener The function that gets called when the event is fired.
     * @param options Additional settings for event listener.
     */
    addEventListener<T extends E['type']>(
        type: T,
        listener: EventListener<E, T, this>,
        options?: EventListenerOptions,
    ): void;

    /**
     * Checks if listener is added to an event type.
     * @param type The type of event to listen to.
     * @param listener The function that gets called when the event is fired.
     */
    hasEventListener<T extends E['type']>(type: T, listener: EventListener<E, T, this>): boolean;

    /**
     * Removes a listener from an event type.
     * @param type The type of the listener that gets removed.
     * @param listener The listener function that gets removed.
     */
    removeEventListener<T extends E['type']>(type: T, listener: EventListener<E, T, this>): void;

    /**
     * Fire an event type.
     * @param event The event object that gets fired.
     */
    dispatchEvent(event: E): void;
}
