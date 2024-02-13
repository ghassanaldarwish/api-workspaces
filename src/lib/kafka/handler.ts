import service from "../../service";

async function messageHandler(action: string, data: any) {
  switch (action) {
    case "findOne":
      return await service.find.findOne(data);

    case "findMany":
      return await service.find.findMany(data);

    case "createOne":
      return await service.create.createOne(data);

    case "createMany":
      return await service.create.createMany(data);

    case "updateOne":
      return await service.update.updateOne(data);

    case "updateMany":
      return await service.update.updateMany(data);

    case "removeOne":
      return await service.remove.removeOne(data);

    case "removeMany":
      return await service.remove.removeMany(data);

    default:
      return null;
  }
}

export default messageHandler;
