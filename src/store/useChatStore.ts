/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";

// import { useAuthStore } from "./useAuthStore";

export type TGetMessagePayload = string;

export interface ISendMessagePayload {
  text?: string;
  image?: string;
}

export interface IUser {
  _id: string;
  email: string;
  fullname: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserChatStore {
  messages: IMessage[];
  users: IUser[];
  selectedUser: IUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: TGetMessagePayload) => Promise<void>;
  sendMessage: (messageData: ISendMessagePayload) => Promise<void>;
  setSelectedUser: (selectedUser: IUser) => void;
}

export const useChatStore = create<IUserChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data.data.data as IUser[] });
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: TGetMessagePayload) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/users/${userId}`);
      set({ messages: res.data.data.data as IMessage[] });
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData: ISendMessagePayload) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...messages, res.data.data.data as IMessage] });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  setSelectedUser: (selectedUser: IUser) => set({ selectedUser }),

  // subscribeToMessages: () => {
  //   const { selectedUser } = get();
  //   if (!selectedUser) return;

  //   const socket = useAuthStore.getState().socket;

  //   socket.on("newMessage", (newMessage) => {
  //     const isMessageSentFromSelectedUser =
  //       newMessage.senderId === selectedUser._id;
  //     if (!isMessageSentFromSelectedUser) return;

  //     set({
  //       messages: [...get().messages, newMessage],
  //     });
  //   });
  // },

  // unsubscribeFromMessages: () => {
  //   const socket = useAuthStore.getState().socket;
  //   socket.off("newMessage");
  // },
}));
