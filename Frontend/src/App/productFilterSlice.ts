import { createSlice, nanoid } from "@reduxjs/toolkit";
import { IFilterItem } from "../types";

let productFilterSlice = createSlice({
    name: 'productFilter',
    initialState: {
        filtres: [
            { id: nanoid(), name: "Молочные продукты", checked: false },
            { id: nanoid(), name: "Сладости", checked: false },
            { id: nanoid(), name: "Фрукты", checked: false },
            { id: nanoid(), name: "Выпечка", checked: false },
            { id: nanoid(), name: "Овощи", checked: false },
            { id: nanoid(), name: "Хлеб", checked: false },
            { id: nanoid(), name: "Рыба и морепродукты", checked: false },
            { id: nanoid(), name: "Мясо и птица", checked: false },
            { id: nanoid(), name: "Снеки", checked: false },
            { id: nanoid(), name: "Вода и напитки", checked: false },
            { id: nanoid(), name: "Замороженные продукты", checked: false },
            { id: nanoid(), name: "Для детей", checked: false },
            { id: nanoid(), name: "Гигиена", checked: false },
            { id: nanoid(), name: "Для дома", checked: false },
            { id: nanoid(), name: "Бакалея", checked: false }
        ],
        others: [
            { id: nanoid(), name: "Акции", checked: false },
        ]
    },
    reducers: {
        toggleFilter: (state, action: {
            payload: {
                updated: IFilterItem[],
                field:  "filtres" | "others"
            }
        }) => {
            let { updated, field } = action.payload
            state[field] = updated
        }
    }
})

export default productFilterSlice.reducer

export let { toggleFilter } = productFilterSlice.actions