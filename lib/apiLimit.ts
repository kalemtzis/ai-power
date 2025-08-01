import { auth } from "@clerk/nextjs/server"
import prismadb from "./prismadb";
import { MAX_FREE_COUNTS } from "@/constants";
import { checkSubscription } from "./subscription";

export const increaseApiLimit = async () => {
  const { userId } = await auth();

  if (!userId) return;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId
    }
  });

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: {
        userId: userId
      },
      data: {
        count: userApiLimit.count + 1
      }
    })
  } else {
    await createApiLimit(userId, 1);
  }
}

const createApiLimit = async (userId: string, limit: number) => {
  const isPro = await checkSubscription();

  let count = limit;

  if (isPro) count = Infinity;

  await prismadb.userApiLimit.create({
    data: {
      userId: userId,
      count: count
    }
  });
}

export const checkApiLimit = async () => {
  const { userId } = await auth();
  const isPro = await checkSubscription();

  if (!userId) return false;

  if (isPro) return true;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId
    }
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else return false;
}

export const getApiLimitCount = async () => {
  const { userId } = await auth();

  if (!userId) return 0;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId
    }
  })

  if (!userApiLimit) return 0;

  return userApiLimit.count;
}