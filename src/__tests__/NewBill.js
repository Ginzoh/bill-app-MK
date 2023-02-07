/**
 * @jest-environment jsdom
 */

import { fireEvent, getByTestId, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { bills } from "../fixtures/bills";
import mockStore from "../__mocks__/store";
import BillsUI from "../views/BillsUI";
import { async } from "regenerator-runtime";
import store from "../app/Store.js";

jest.mock("../app/store", () => mockStore);

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname });
};

beforeEach(() => {
  document.body.innerHTML = NewBillUI();
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Employee",
    })
  );
});

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
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
    test("Then the form should be rendered", () => {
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });
    test("Then the submit button should work as intended", () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      const handleClickSubmit = jest.fn(newBill.handleSubmit);

      const myForm = screen.getByTestId("form-new-bill");
      myForm.addEventListener("submit", handleClickSubmit);

      fireEvent.submit(myForm);
      expect(handleClickSubmit).toHaveBeenCalled();
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    });

    test("Then the file input should work", (done) => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const testImageFile = new File(["hello"], "hello.png", {
        type: "image/png",
      });
      const handleClickFile = jest.fn((e) => {
        newBill.handleChangeFile(e);
        done();
      });

      const file = screen.getByTestId("file");
      file.addEventListener("change", handleClickFile);
      fireEvent.change(file, { target: { files: [testImageFile] } });
      expect(file.files[0]).toEqual(testImageFile);
      expect(handleClickFile).toHaveBeenCalled();
    });
  });
  describe("When I create a new bill", () => {
    test("Then posts bill with mock API POST", async () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const myForm = screen.getByTestId("form-new-bill");
      const updating = jest.spyOn(mockStore.bills(), "update");
      fireEvent.submit(myForm);
      expect(updating).toHaveBeenCalled();
    });
    test("Then posts bill with mock API POST and fails with error 404", async () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const myForm = screen.getByTestId("form-new-bill");
      jest
        .spyOn(mockStore.bills(), "update")
        .mockRejectedValueOnce(new Error("Error 404"));
      try {
        fireEvent.submit(myForm);
      } catch (error) {
        expect(error.message).toBe("Error 404");
      }
    });
    test("Then posts bill with mock API POST and fails with error 500", async () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const myForm = screen.getByTestId("form-new-bill");
      jest
        .spyOn(mockStore.bills(), "update")
        .mockRejectedValueOnce(new Error("Error 500"));
      try {
        fireEvent.submit(myForm);
      } catch (error) {
        expect(error.message).toBe("Error 500");
      }
    });
  });
});
