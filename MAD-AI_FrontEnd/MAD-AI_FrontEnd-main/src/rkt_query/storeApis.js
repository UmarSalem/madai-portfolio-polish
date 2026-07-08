

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LANGUAGES, setSelectedLanguage } from "./SettingsReducer";
import { Config } from "./../../constant/index";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import CryptoJS from "crypto-js";
import { decryptStoredData } from "app/pages/storetoken/StoreTokenCheck";
import Flag from "react-world-flags";
import { Description } from "@mui/icons-material";

const TAG_TYPES = {
  User: "User",

};

function providesList(resultsWithIds, tagType) {
  // console.log("resultsWithIds",resultsWithIds)
  return resultsWithIds
    ? [
        { type: tagType, id: "LIST" },
        ...resultsWithIds?.map(({ id }) => ({ type: tagType, id })),
      ]
    : [{ type: tagType, id: "LIST" }];
}

export const aiDoctorApi = createApi({
  reducerPath: "aiDoctorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Config.serverUrl + "api/admin/",

    prepareHeaders: async (headers, { getState, endpoint }) => {
      // const decrypt_token = localStorage.getItem(Config.adminApiTokenName)
      // const bytes = CryptoJS.AES.decrypt(decrypt_token, Config.secretPass);
      // const storedToken = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const storedToken = decryptStoredData(Config.adminApiTokenName);
      // console.log("object",storedToken);
      if (storedToken && endpoint !== "refresh")
        headers.set("Authorization", `Bearer ${storedToken}`);
      headers.set("Accept", "application/json");
      // headers.set('Content-Type', 'application/json');

      return headers;
    },
    // credentials: 'include', // This allows server to set cookies
  }),
  tagTypes: [
    TAG_TYPES.User,
 
    
  ],
  endpoints: (builder) => ({
    /* START: User API's*/
    userLogin: builder.mutation({
      query(body) {
        return { url: `login`, method: "POST", body };
      },
      invalidatesTags: [{ type: TAG_TYPES.User, id: "LIST" }],
    }),
    getMe: builder.query({ query: () => `me`, providesTags: (result) => [] }),
    /* END: User API's*/

    /* START: Admin API's*/
    getAllAdmins: builder.query({
      query: () => "admins",
      providesTags: (result) =>
        providesList(result?.data?.admins, TAG_TYPES.Admin),
    }), //
    getAdmin: builder.query({
      query: (id) => `admins/${id}`,
      providesTags: (result, error, id) => [{ type: TAG_TYPES.Admin, id }],
    }),
    addAdmin: builder.mutation({
      query(body) {
        return { url: `admins`, method: "POST", body };
      },
      invalidatesTags: [{ type: TAG_TYPES.Admin, id: "LIST" }],
    }),
    updateAdmin: builder.mutation({
      query(body) {
        return { url: `update-admin`, method: "POST", body };
      },
      invalidatesTags: (result, error, obj) => [
        { type: TAG_TYPES.Admin, id: obj?.id },
      ],
    }),
    deleteAdmin: builder.mutation({
      query(id) {
        return { url: `admins/${id}`, method: "DELETE" };
      },
      invalidatesTags: (result, error, id) => [{ type: "Admin", id }],
    }),
    /* END: Admin API's*/


   


    /* END: Page API's*/
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  /* User API's */
  useUserLoginMutation,
  useGetMeQuery,

  /* Admin API's*/
  useGetAllAdminsQuery,
  useAddAdminMutation,
  useGetAdminQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
 
} = aiDoctorApi;


