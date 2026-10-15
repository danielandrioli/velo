import { test, expect } from '../support/fixtures';
import { ConfigurePage } from '../pages/ConfigurePage';
import { CarColor, Optionals, WheelType } from '../support/data/car_config_data';

test.beforeEach('Enter configuration page', async ({ configurePage }) => {
    await configurePage.open()
    await configurePage.checkPageLoaded()
})

test('Car color and wheels selection should be reflected on the car image', async ({ configurePage }) => {
    let selectedColor = CarColor.LunarWhite
    let selectedWheels = WheelType.Sport
    await selectAndAssert(configurePage, selectedColor, selectedWheels)

    selectedColor = CarColor.MidnightBlack
    selectedWheels = WheelType.Aero
    await selectAndAssert(configurePage, selectedColor, selectedWheels)

    selectedColor = CarColor.GlacierBlue
    selectedWheels = WheelType.Sport
    await selectAndAssert(configurePage, selectedColor, selectedWheels)
})

async function selectAndAssert(configurePage: ConfigurePage, color: CarColor, wheel: WheelType) {
    await configurePage.selectColor(color)
    await configurePage.selectWheels(wheel)
    await configurePage.carImageShouldReflectSelectedColorAndWheels(color, wheel)
}

test('Wheel changes should alter the car price', async ({ configurePage }) => {
    const initialPrice = await configurePage.getCarPrice()
    console.log('initialPrice: ' + initialPrice)
    await configurePage.selectWheels(WheelType.Sport)
    const newPrice = await configurePage.getCarPrice()
    console.log('newPrice: ' + newPrice)
    expect(newPrice).not.toBe(initialPrice)
    await configurePage.selectWheels(WheelType.Aero) // Going back to Aero
    const newPrice2 = await configurePage.getCarPrice()
    expect(newPrice2).toBe(initialPrice)
})

test('Optional changes should alter the car price - FluxCapacitor', async ({ configurePage }) => {
    const initialPrice = await configurePage.getCarPrice()
    await configurePage.selectOptionals(Optionals.FluxCapacitor)
    let newPrice_optional1 = await configurePage.getCarPrice()
    expect(newPrice_optional1).not.toBe(initialPrice)

    await configurePage.selectOptionals(Optionals.FluxCapacitor) // Deselecting the selected optional
    newPrice_optional1 = await configurePage.getCarPrice()
    expect(newPrice_optional1).toBe(initialPrice)
})

test('Optional changes should alter the car price - Precision Park', async ({ configurePage }) => {
    const initialPrice = await configurePage.getCarPrice()
    await configurePage.selectOptionals(Optionals.PrecisionPark)
    let newPrice_optional1 = await configurePage.getCarPrice()
    expect(newPrice_optional1).not.toBe(initialPrice)

    await configurePage.selectOptionals(Optionals.PrecisionPark) // Deselecting the selected optional
    newPrice_optional1 = await configurePage.getCarPrice()
    expect(newPrice_optional1).toBe(initialPrice)
})
