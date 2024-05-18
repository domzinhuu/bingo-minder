export enum GameEvents {
  availableRooms = "get_available_room",
  startNewRoom = "start_new_room",
  socketPlayer = "set_socket_player",
  gameUpdated = "game_updated",
  updateAvailableRooms = "update_available_rooms",
  addNewPlayer = "add_player_to_room",
  drawNumber = "draw_new_number",
  approvePlayer = "approve_player",
  rejectPlayer = "reject_player",
  connect = "connect",
  refreshSession = "refresh_session",
}
