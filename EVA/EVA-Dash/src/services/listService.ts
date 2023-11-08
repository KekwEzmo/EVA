import { ListModel } from "../models/listModel";

/**
 * Retrive sample data
 * @returns data for list widget
 */
export const getListData = (): ListModel[] => [
  {
    id: "id1",
    title: "TicketTitle",
    head: "ShortDesc",
    content: "Lorem ipsum dolor sit amet",
  },
  {
    id: "id2",
    title: "TicketTitle",
    head: "ShortDesc",
    content: "Lorem ipsum dolor sit amet",
  },
  {
    id: "id3",
    title: "TicketTitle",
    head: "ShortDesc",
    content: "Lorem ipsum dolor sit amet",
  },
];
