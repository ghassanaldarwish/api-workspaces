import paginate from "./plugins/paginate.plugin";
import toJSON from "./plugins/toJSON.plugin";
import mongoose from "mongoose";

export enum Role {
  member = "member",
  admin = "admin",
  owner = "owner",
}

const Schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "Please provide user id"],
      trim: true,
    },
    vscodePassword: {
      type: String,
      required: [true, "Please provide vscodePassword"],
    },

    role: {
      type: String,
      required: [true, "Please provide role"],
      default: Role.member,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

Schema.plugin(toJSON);
Schema.plugin(paginate);

export default (prefix: string) =>
  mongoose.model(prefix + ".workspaces", Schema);
