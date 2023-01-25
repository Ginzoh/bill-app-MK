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

const anewBill = {
  id: "47qAXb6fIm2zOKkLzMro",
  vat: "80",
  fileUrl:
    "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
  status: "accepted",
  type: "Hôtel et logement",
  commentAdmin: "ok",
  commentary: "séminaire billed",
  name: "encore",
  fileName: "preview-facture-free-201801-pdf-1.jpg",
  date: "2004-04-04",
  amount: 400,
  email: "a@a",
  pct: 20,
};

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
});

// describe("Given I am a user connected as User", () => {
//   describe("When I submit a new bill", () => {
//     test("Then bill is posted with mock API POST", async () => {
//       const newBill = new NewBill({
//         document,
//         onNavigate,
//         store: null,
//         localStorage: window.localStorage,
//       });

//       let name = screen.getByTestId("expense-name");
//       name.value = "A new bill";
//       expect(screen.getByTestId("expense-name").value).toBe("A new bill");
//       let theDate = screen.getByTestId("datepicker");
//       theDate.value = "2023-01-01";
//       expect(screen.getByTestId("datepicker").value).toBe("2023-01-01");
//       let ttc = screen.getByTestId("amount");
//       ttc.value = "350";
//       expect(screen.getByTestId("amount").value).toBe("350");
//       let tva = screen.getByTestId("pct");
//       tva.value = "20";
//       expect(screen.getByTestId("pct").value).toBe("20");
//       const testImageFile = new File(["hello"], "hello.png", {
//         type: "image/png",
//       });
//       // const fileInput = screen.getByTestId("file");
//       // userEvent.upload(fileInput, testImageFile);
//       // expect(fileInput.files.length).toBe(1);
//     });
//   });
// });
