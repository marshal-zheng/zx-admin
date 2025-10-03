import { Component } from 'vue'
import type { DataGridColumn } from '../types'
import InputCell from '../cells/InputCell.vue'
import SelectCell from '../cells/SelectCell.vue'
import NumberCell from '../cells/NumberCell.vue'
import TextareaCell from '../cells/TextareaCell.vue'
import DatePickerCell from '../cells/DatePickerCell.vue'
import SwitchCell from '../cells/SwitchCell.vue'

/**
 * Composable for cell rendering logic
 */
export function useCellRenderer() {
  const cellComponentMap: Record<string, Component> = {
    input: InputCell,
    select: SelectCell,
    number: NumberCell,
    textarea: TextareaCell,
    datePicker: DatePickerCell,
    switch: SwitchCell
  }

  const getCellComponent = (column: DataGridColumn): Component => {
    if (column.cellRenderer) {
      return column.cellRenderer
    }

    const type = column.type || 'input'
    return cellComponentMap[type] || InputCell
  }

  return {
    getCellComponent
  }
}
