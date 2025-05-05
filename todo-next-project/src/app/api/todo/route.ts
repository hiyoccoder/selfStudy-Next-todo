import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// グローバルスコープでPrismaClientのインスタンスを宣言
declare global {
  var prisma: PrismaClient | undefined;
}

// PrismaClientのシングルトンインスタンスを作成
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Todo取得
export const GET = async (req: Request, res: NextResponse) => {
  try {
    const todos = await prisma.todo.findMany();
    return NextResponse.json({ message: "success", todos }, { status: 200 });
  } catch (err) {
    console.error("GETエラー:", err);
    return NextResponse.json(
      {
        message: "Error",
        error: err instanceof Error ? err.message : "不明なエラー",
      },
      { status: 500 }
    );
  }
};

// Todoの作成
export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Error", error: "titleとcontentは必須です" },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({ data: { title, content } });
    return NextResponse.json({ message: "success", todo }, { status: 201 });
  } catch (err) {
    console.error("POSTエラー:", err);
    return NextResponse.json(
      {
        message: "Error",
        error: err instanceof Error ? err.message : "不明なエラー",
      },
      { status: 500 }
    );
  }
};
