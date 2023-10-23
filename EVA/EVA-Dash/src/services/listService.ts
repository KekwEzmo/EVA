import { ListModel } from "../models/listModel";

/**
 * Retrive sample data
 * @returns data for list widget
 */
export const getListData = (): ListModel[] => [
  {
    id: "id1",
    
    title: "S",
    content: "Lorem ipsum dolor sit amet",
  },
  {
    id: "id2",
    title: "Lorem ipsum",
    content: "Lorem ipsum dolor sit amet",
  },
  {
    id: "id3",
    title: "Lorem ipsum",
    content: "Lorem ipsum dolor sit amet",
  },
];
