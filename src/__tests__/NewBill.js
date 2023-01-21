/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeAll(() => {
      const html = NewBillUI();
      document.body.innerHTML = html;
    });
    test("Then the options should be rendered correctly", () => {
      expect(screen.getByText("Transports")).toBeTruthy();
      expect(screen.getByText("Restaurants et bars")).toBeTruthy();
      expect(screen.getByText("Hôtel et logement")).toBeTruthy();
      expect(screen.getByText("Services en ligne")).toBeTruthy();
      expect(screen.getByText("IT et électronique")).toBeTruthy();
      expect(screen.getByText("Equipement et matériel")).toBeTruthy();
      expect(screen.getByText("Fournitures de bureau")).toBeTruthy();
    });
    test("Then the name input should be rendered correctly", () => {
      expect(screen.getByTestId("expense-name")).toBeTruthy();
    });
    test("Then the date input should be rendered correctly", () => {
      expect(screen.getByTestId("datepicker")).toBeTruthy();
    });
    test("Then the TTC input should be rendered correctly", () => {
      expect(screen.getByTestId("amount")).toBeTruthy();
    });
    test("Then the TVA input should be rendered correctly", () => {
      expect(screen.getByTestId("vat")).toBeTruthy();
    });
    test("Then the number input should be rendered correctly", () => {
      expect(screen.getByTestId("pct")).toBeTruthy();
    });
    test("Then the comments input should be rendered correctly", () => {
      expect(screen.getByTestId("commentary")).toBeTruthy();
    });
    test("Then the submit button should work", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      );
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      const event = {
        preventDefault: jest.fn(),
        clipboardData: {
          getData: () => pasteValue,
        },
      };
      // const event = { preventDefault: () => {} };
      jest.spyOn(event, "preventDefault");
      const handleClickSubmit = jest.fn((e) => newBill.handleSubmit());
      const newForm = screen.getByText("Envoyer");
      const myForm = screen.getByTestId("form-new-bill");
      myForm.addEventListener("submit", handleClickSubmit);
      userEvent.click(newForm);
      fireEvent.submit(myForm);
      // myForm.find("form").simulate("submit", { preventDefault });
      expect(handleClickSubmit).toHaveBeenCalled();
    });
  });
});
