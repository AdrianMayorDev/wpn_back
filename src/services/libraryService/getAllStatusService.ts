import GameStatusModelDTO from '@/DTO/gameStatusModel/GameStatusModelDTO';

const getAllStatusService = async (libraryModel: GameStatusModelDTO, userId: string) => {
  const allStatuses = await libraryModel.getAllStatus(userId);
  if (!allStatuses) {
    throw new Error('No game statuses found');
  }

  return allStatuses;
};

export default getAllStatusService;
