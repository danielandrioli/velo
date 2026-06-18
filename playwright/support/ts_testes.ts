import { number } from "zod";
// Category 1 - Basic Coding Challenges
/* 1.
Could you create in any language a function that sums an array of Numbers?  For example:   2, 4, 10, 1, 20
OBS: The function must work for any entry of array given and needs to be created by your own, not using pre existing functions
*/
function sumArray(mArray: number[]): number {
    let sum: number = 0;
    for (let i = 0; i < mArray.length; i++) {
        sum = sum + mArray[i]
    }

    return sum
}
console.log(sumArray([2, 4, 10, 1, 20]))

/*  2. Implement a function that returns the largest number in an array without using Math.max */
function maxNumberInArray(mArray: number[]): number {
    let maxNum: number = mArray[0]

    for (let i = 1; i < mArray.length; i++) {
        if (mArray[i] > maxNum) {
            maxNum = mArray[i]
        }
    }
    return maxNum;
}

console.log(maxNumberInArray([77, 0, -45, 100, 511]))

function countCharInString(mString: string, mChar: string): number {
    let counter = 0
    for (let i = 0; i < mString.length; i++) {
        if (mChar == mString[i]) {
            counter++
        }
    }
    return counter
}
console.log(countCharInString('banana', 'a'))

/* 3. Reverse a string without using reverse(). */
function reverseString(mString: string): string {
    let reversedString: string = ''
    for (let i = (mString.length - 1); i >= 0; i--) {
        reversedString = reversedString + mString[i]
    }
    return reversedString
}
console.log(reverseString('Daniel'))

/* 4. Determine whether a word is a palindrome.*/
function isPalindrome(mString: string) {
    let reversedWord: string = ''
    for(let i = (mString.length - 1); i >= 0; i--) {
        reversedWord = reversedWord + mString[i]
    }

    if (reversedWord.toLocaleLowerCase() == mString.toLocaleLowerCase()) {
        return true
    }
    return false
}
console.log(isPalindrome('radar'))

/* Remove duplicated values from an array. */
function removeDuplicatedValuesFromArray(mArray: number[]): number[] {
    let newArrayWithoutRepeatedValues: number[] = []
    for(let i = 0; i < mArray.length; i++) {
        if(!newArrayWithoutRepeatedValues.includes(mArray[i])) {
            newArrayWithoutRepeatedValues.push(mArray[i])
        }
    }
    return newArrayWithoutRepeatedValues
}
console.log(removeDuplicatedValuesFromArray([1, 2, 2, 4, 4, 4, 7, 1, 84, 12]))

/* Category 2 - TypeScript Questions */ 
/*
Create a TypeScript interface for:
{
  "id": 1,
  "name": "Daniel",
  "email": "daniel@email.com",
  "active": true
}
*/
interface User {
    id: number,
    name: string,
    email: string,
    active: boolean
}

// Explain the difference between: interface and type
/*
Interface is a contract or "shape" an object must follow to be created.
The biggest differences between interface and typea are:
- Declaration merging. Two or more interfaces declared with the same name will be merged, while the same is not true for types
- Types can alias primitives, create union types and handle tuples
*/

/* 
Challenge 10: How would you avoid this?

await page.waitForTimeout(5000);

What would you use instead?

R: Playwright has auto-wait feature, so explicit waits are not needed. 
If I want to increase the timeout for a specific test, then I can use test.setTimeout() 
*/


/*
Challenge 13:
await page.click("#save"); 
The test fails intermittently in CI. How would you debug it?

I'd ensure the trace setting are configured in the playwright.config.ts
use: {
  trace: 'retain-on-failure',
  ..
}
Also, I'd ensure the save button is truly visible and enabled before clicking by making an assertion with "expect"
If the element is covered by an overlay, I could try to use force: true 

*/

/*
Challenge 14:
You have 1000 Playwright tests. Execution takes 3 hours. How would you reduce execution time?
R: I'd check if we have explicit waits in our code. If I find some, I'll try to understand why and try to rely only on Playwright auto-waits. There's a good chance explicit waits are being misused.
Then I'd check if we are working with test paralelization, and if not, I'd configure parallel tests. Also I'd ensure we're always running the tests on headless mode.
I'd group the tests by priorization: high, medium, low. The high priority tests are the smoke tests. Then I'd set the pipeline to be configurable: when there's no much time to run then, we could run
just the high priority tests.
I'd also ensure we're not relying on UI to make the test setups, always doing it via API.
*/

/*
Challenge 15
You notice this code:

test("Create user", async () => {
   await login();
   await createUser();
});

test("Delete user", async () => {
   await login();
   await deleteUser();
});

How would you improve it?

R:
It seems Page Object Model is not used here, so I'd create page classes. I'd login via API, then use the page object injected in the test via fixture for both tests. 
In the "Create user" test, after the user is created, I'd delete it via API (teardown). In the "Delete user" test, I'd create it via API and make the deletion via UI (the test objective). 
I could create a fallback to delete it via API if the test fails (the deletion via UI). 
I'd also rename both tests for something like: "Should create user successfully" and "Should delete user sucessfully".
I could improve these names if I had more details about what actually is being tested.
*/