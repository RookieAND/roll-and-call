"use client";

import { catchError } from "next/error";

import { MyHomebrewError } from "./my-homebrew-error";

export const MyHomebrewErrorBoundary = catchError(MyHomebrewError);
