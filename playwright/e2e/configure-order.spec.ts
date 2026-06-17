import { test } from '../support/fixtures';
import { ConfigurePage } from '../pages/ConfigurePage';
import { CarColor, WheelType } from '../support/car_config_data';

test.beforeEach('Enter configuration page', async ({ configurePage }) => {
    await configurePage.open()
    await configurePage.checkPageLoaded()
})

test('Car color selection should be reflected on the car image', async ({ configurePage }) => {
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
