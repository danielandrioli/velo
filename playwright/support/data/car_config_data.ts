export enum CarColor {
    GlacierBlue = 'Glacier Blue',
    MidnightBlack = 'Midnight Black',
    LunarWhite = 'Lunar White'
}

export enum WheelType {
    Aero = 'aero',
    Sport = 'sport',
}

export enum Optionals {
    PrecisionPark = 'Precision Park',
    FluxCapacitor = 'Flux Capacitor'
}

export type Car = {
    color: CarColor,
    wheels: WheelType,
    optional1: Optionals.PrecisionPark | undefined,
    optional2: Optionals.FluxCapacitor | undefined
}

export function getRandomCarConfig(): Car {
    // 1. Get an array of the enum values: ['Glacier Blue', 'Midnight Black', 'Lunar White']
    const colors = Object.values(CarColor);
    const wheels = Object.values(WheelType);
    const optionals1: (Optionals.PrecisionPark | undefined)[] = [Optionals.PrecisionPark, undefined]; // The array has 'undefined' because the user may not want an optional
    const optionals2: (Optionals.FluxCapacitor | undefined)[] = [Optionals.FluxCapacitor, undefined];

    // 2. Select a random index and grab the value
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomWheel = wheels[Math.floor(Math.random() * wheels.length)];
    const randomOptional1 = optionals1[Math.floor(Math.random() * optionals1.length)];
    const randomOptional2 = optionals2[Math.floor(Math.random() * optionals2.length)];

    let car: Car = {
        color: randomColor,
        wheels: randomWheel,
        optional1: randomOptional1,
        optional2: randomOptional2
    }
    return car;
}