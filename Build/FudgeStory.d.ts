declare namespace FudgeStory {
    import ƒ = FudgeCore;
    export import ORIGIN = FudgeCore.ORIGIN2D;
    type Position = ƒ.Vector2;
    let Position: typeof ƒ.Vector2;
}
declare namespace FudgeStory {
    import ƒ = FudgeCore;
    /**
     * The [[Stage]] is where the [[Character]]s and [[Location]] show up. It's the main instance to work with.
     */
    abstract class Base {
        protected static viewport: ƒ.Viewport;
        protected static back: ƒ.Node;
        protected static middle: ƒ.Node;
        protected static front: ƒ.Node;
        private static mesh;
        private static aspectRatio;
        private static graph;
        private static size;
        /**
         * Will be called once by [[Progress]] before anything else may happen on the [[Stage]].
         */
        protected static create(): void;
        /**
         * Creates a serialization-object representing the current state of the [[Character]]s currently shown on the stage
         */
        protected static serialize(): ƒ.Serialization;
        /**
         * Reconstructs the [[CharacterNode]]s from a serialization-object and places them on the stage
         * @param _serialization
         */
        protected static deserialize(_serialization: ƒ.Serialization): Promise<void>;
        protected static createImageNode(_name: string, _request: RequestInfo, _origin?: ƒ.ORIGIN2D, _size?: ƒ.Vector2): Promise<ƒ.Node>;
        private static adjustMesh;
        private static calculatePositions;
        private static resize;
    }
}
declare namespace FudgeStory {
    import ƒ = FudgeCore;
    /**
     * ## Pattern for the definition of characters
     * Define characters to appear on the stage in various poses using this pattern
     * ```plaintext
     * {
     *   id of the character: {
     *     name: "Name of the character to appear on the text board",
     *     origin: the origin of the image, in most cases FudgeStory.ORIGIN.BOTTOMCENTER,
     *     pose: {
     *       id of 1st pose: "path to the image to be used for 1st pose",
     *       id of 2nd pose: "path to the image to be used for 2nd pose",
     *       ...
     *     }
     *   },
     *   id of the character: {
     *     ... same pattern as above
     *   },
     *   ... more characters as above
     * }
     * ```
     * ## Example
     * ```typescript
     * export let chars = {
     *   Sue: {
     *     name: "Susan Rice",
     *     origin: FudgeStory.ORIGIN.BOTTOMCENTER,
     *     pose: {
     *       normal: "../Characters/placeholder_girl.png",
     *       talk: "../Characters/placeholder_girl_talk.png"
     *     }
     *   },
     *   John: {
     *     name: "John Wick"
     *     ...
     *   },
     * }
     * ```
     */
    interface CharacterDefinition {
        /** Name of the character to appear on the text board */
        name: string;
        /** The origin of the characters images, in most cases FudgeStory.ORIGIN.BOTTOMCENTER, */
        origin: ORIGIN;
        /** A list of key-value-pairs defining various poses of the character and holding the urls to the according images
         * ```typescript
         * {
         *   id of 1st pose: "path to the image to be used for 1st pose",
         *   id of 2nd pose: "path to the image to be used for 2nd pose",
         *   ...
         * }
         * ```
         */
        pose: {
            [id: string]: RequestInfo;
        };
    }
    /**
     *  Holds the internal data needed to display a character
     */
    class Character extends Base {
        private static characters;
        poses: Map<RequestInfo, ƒ.Node>;
        origin: ƒ.ORIGIN2D;
        private definition;
        private constructor();
        /**
         * Retrieve the [[CharacterNode]] from the name defined in the [[Character]]-object given or creates a new [[CharacterNode]] using that object
         */
        static get(_character: CharacterDefinition): Character;
        /**
         * Retrieve the [[CharacterNode]] from the name given or null if not defined yet
         */
        static getByName(_name: string): Character;
        /**
         * Show the given [[Character]] in the specified pose at the given position on the stage. See [[Character]] for the definition of a character.
         */
        static show(_character: CharacterDefinition, _pose: RequestInfo, _position: Position): Promise<void>;
        /**
         * Hide the given [[Character]], removing it from the [[Stage]]
         */
        static hide(_character: CharacterDefinition): Promise<void>;
        /**
         * Remove all [[Character]]s and objects from the stage
         */
        static hideAll(): void;
        /**
         * Retrieves a node displaying the pose defined by the given url of an image file. Creates a new one if not yet existent.
         */
        getPose(_pose: RequestInfo): Promise<ƒ.Node>;
        private createPose;
    }
}
declare namespace FudgeStory {
    enum EVENT {
        KEYDOWN = "keydown",
        KEYUP = "keyup",
        POINTERDOWN = "pointerdown",
        POINTERUP = "pointerup"
    }
    type Signal = () => Promise<Event>;
    class Input {
        /**
         * Wait for the viewers input. See [[EVENT]] for predefined events to wait for.
         */
        static get(_eventTypes: string[]): Promise<Event>;
    }
}
declare namespace FudgeStory {
    import ƒ = FudgeCore;
    /**
     * Inserts the given scene. A scene is a sequence of commands defining a small piece of the whole story.
     * A scene needs to be defined in the following format, where NameOfTheScene is a placeholder and should be chosen arbitrarily.
     * ```typescript
     * export async function NameOfTheScene(): SceneReturn {
     *   ...
     *   ...
     * }
     * ```
     * Calling [[insert]] directly will not register the scene as a save-point for saving and loading.
     */
    function insert(_scene: SceneFunction): Promise<void | string>;
    /**
     * Display the recent changes to the [[Stage]]. If a parameters are specified, they are used blend from the previous display to the new
     * as described in [[Transition]]
     */
    function update(_duration?: number, _url?: RequestInfo, _edge?: number): Promise<void>;
    /**
     * Wait for the viewers input. See [[EVENT]] for predefined events to wait for.
     */
    function getInput(_eventTypes: string[]): Promise<Event>;
    let positions: {
        topleft: ƒ.Vector2;
        topright: ƒ.Vector2;
        topcenter: ƒ.Vector2;
        centerleft: ƒ.Vector2;
        centerright: ƒ.Vector2;
        center: ƒ.Vector2;
        bottomleft: ƒ.Vector2;
        bottomright: ƒ.Vector2;
        bottomcenter: ƒ.Vector2;
        left: ƒ.Vector2;
        right: ƒ.Vector2;
    };
    /**
     * Calculates and returns a position on the [[Stage]] to be used to place [[Character]]s or objects on the [[Stage]].
     * Pass values in percent relative to the upper left corner.
     */
    function positionPercent(_x: number, _y: number): Position;
}
declare namespace FudgeStory {
    import ƒ = FudgeCore;
    interface LocationDefinition {
        name?: string;
        background: string;
        foreground?: string;
    }
    /**
     * Define locations using this pattern:
     * ```plaintext
     * {
     *   id of the location: {
     *     name: "Name of the location" (optional),
     *     background: "path to the image to be used as the background",
     *     foreground: "path to the image to be used as the foreground" (optional),
     *   },
     *   id of the location: {
     *     ... same pattern as above
     *   },
     *   ... more locations as above
     * }
     * ```
     */
    interface LocationDefinitions {
        [id: string]: LocationDefinition;
    }
    /**
     * Holds internal data to effectively load and display the location images
     */
    class Location extends Base {
        private static locations;
        background: ƒ.Node;
        foreground: ƒ.Node;
        private constructor();
        /**
         * Retrieves the [[LocationNode]] associated with the given description
         */
        static get(_description: LocationDefinition): Promise<Location>;
        /**
         * Show the given location on the [[Stage]]. See [[Location]] for the definition of a location.
         */
        static show(_location: LocationDefinition): Promise<void>;
        private load;
    }
}
declare namespace FudgeStory {
    class Menu {
        private dialog;
        private callback;
        private constructor();
        /**
         * Displays a modal dialog showing buttons with the texts given as values with the options-object to be selected by the user.
         * Use with `await` to receive the text the user selected while the dialog closes.
         * The class-parameter allows for specific styling with css.
         */
        static getInput(_options: Object, _cssClass?: string): Promise<string>;
        /**
         * Displays a non-modal dialog showing buttons with the texts given as values with the options-object to be selected by the user.
         * When the user uses a button, the given callback function is envolde with the key the selected text is associated with. The class-parameter allows for specific styling with css.
         * Returns a [[Menu]]-object.
         */
        static create(_options: Object, _callback: (_option: string) => void, _cssClass?: string): Menu;
        private static createDialog;
        close(): void;
        open(): void;
        private hndSelect;
    }
}
declare namespace FudgeStory {
    type SceneReturn = Promise<void | string>;
    type SceneFunction = () => SceneReturn;
    type SceneDescriptor = {
        scene: SceneFunction;
        name: string;
        id?: string;
        next?: string;
    };
    type Scenes = (SceneDescriptor | Scenes)[];
    /**
     * Controls the main flow of the story, tracks logical data and provides load/save
     */
    class Progress extends Base {
        private static data;
        private static serialization;
        private static scenes;
        private static currentSceneDescriptor;
        /**
         * Starts the story with the scenes-object given.
         * Creates the [[Stage]] and reads the url-searchstring to enter at a point previously saved
         */
        static go(_scenes: Scenes): Promise<void>;
        /**
         * Defines the object to track containing logical data like score, states, textual inputs given by the play etc.
         */
        static setData(_data: Object): void;
        /**
         * Opens a dialog for file selection, loads selected file and restarts the program with its contents as url-searchstring
         */
        static load(): Promise<void>;
        /**
         * Saves the state the program was in when starting the current scene from [[Progress]].play(...)
         */
        static save(): Promise<void>;
        /**
         * Defines a [[Signal]] which is a bundle of promises waiting for a set of events to happen.
         * Example:
         * ```typescript
         * // define a signal to observe the keyboard for a keydown-event and a timeout of 5 seconds
         * let signal: Signal = Progress.defineSignal([ƒT.EVENT.KEYDOWN, () => ƒT.Progress.delay(5)]);
         * // wait for the signal to become active
         * await signal();
         * ```
         *
         */
        static defineSignal(_promiseFactoriesOrEventTypes: (Function | EVENT)[]): Signal;
        /**
         * Wait for the given amount of time in milliseconds to pass
         */
        static delay(_lapse: number): Promise<void>;
        private static bundlePromises;
        private static start;
        private static restoreData;
        private static storeData;
        private static splash;
        private static splashBlob;
    }
}
declare namespace FudgeStory {
    import ƒ = FudgeCore;
    /**
     * Controls the audio signals emitted
     */
    class Sound {
        private static sounds;
        private static node;
        private cmpAudio;
        private loop;
        private fadingToVolume;
        private constructor();
        /**
         * Plays the audiofile defined by the given url with the given volume and loops it, if desired
         */
        static play(_url: RequestInfo, _volume: number, _loop?: boolean): Sound;
        /**
         * Changes the volume of the sound defined by the url linearly of the given duration to the define volume.
         * If the sound is not currently playing, it starts it respecting the loop-flag.
         */
        static fade(_url: RequestInfo, _toVolume: number, _duration: number, _loop?: boolean): Promise<void>;
        static serialize(): ƒ.Serialization[];
        static deserialize(_serialization: ƒ.Serialization[]): void;
        private static setup;
    }
}
declare namespace FudgeStory {
    import ƒ = FudgeCore;
    /**
     * Displays the phrases told by the characters or the narrator
     */
    class Speech {
        static signalForwardTicker: Signal;
        static signalNext: Signal;
        private static element;
        private static time;
        private static delayLetter;
        private static delayParagraph;
        private static get div();
        /**
         * Displays the [[Character]]s name and the given text at once
         */
        static set(_character: Object, _text: string): void;
        /**
         * Displays the [[Character]]s name and slowly writes the text letter by letter
         */
        static tell(_character: Object, _text: string, _waitForSignalNext?: boolean): Promise<void>;
        /**
         * Defines the pauses used by ticker between letters and before a paragraph
         */
        static setTickerDelays(_letter: number, _paragraph?: number): void;
        /**
         * Clears the speech
         */
        static clear(): void;
        /**
         * Hides the speech
         */
        static hide(): void;
        /**
         * Shows the speech
         */
        static show(): void;
        /**
         * Displays an input field to be filled by the user and returns the input
         */
        static getInput(): Promise<string>;
        /**
         * Returns a serialization-object holding the current state of the speech
         */
        static serialize(): ƒ.Serialization;
        /**
         * Restores the state of the speech given with the serialization-object
         */
        static deserialize(_serialization: ƒ.Serialization): void;
        private static copyByLetter;
    }
}
declare namespace FudgeStory {
    /**
     * Displays a longer narrative text to convey larger parts of the story not told by a character
     * (Better name required)
     */
    class Text extends HTMLDialogElement {
        private static get dialog();
        /**
         * Prints the text in a modal dialog stylable with css
         */
        static print(_text: string): Promise<void>;
        /**
         * sets the classname of the dialog to enable specific styling
         */
        static setClass(_class: string): void;
        /**
         * adds a classname to the classlist of the dialog to enable cascading styles
         */
        static addClass(_class: string): void;
        static close(): void;
    }
}
declare namespace FudgeStory {
    class Transition {
        private static transitions;
        static blend(_imgOld: ImageData, _imgNew: ImageData, _duration: number, _transition: Uint8ClampedArray, _factor?: number): Promise<void>;
        static get(_url: RequestInfo): Promise<Uint8ClampedArray>;
        private static getPromise;
    }
}
