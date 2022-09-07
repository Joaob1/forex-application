import { fireEvent, render, screen } from "@testing-library/react";
import Main from "../pages/Main";
describe("App", () => {
  it("Should change the text content of the change type button", () => {
    render(<Main />);
    const changeTypeButton = screen.getByTestId("changeTypeButton");
    fireEvent.click(changeTypeButton);
    expect(changeTypeButton.textContent).toBe("🔁 USD to GBP");
  });
  it("Should be add the exchange to the exchange history", async () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });
    afterAll(() => {
      jest.useRealTimers();
    });
    render(<Main />);
    jest.advanceTimersByTime(3000);
    const testando = await screen.findByText("Exchange History");
    expect(testando).toBe("oi");
  });
});
