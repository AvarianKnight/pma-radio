globalThis.loadModel = async (modelHash) => {
	RequestModel(modelHash);
	const timeout = GetGameTimer() + 500;
	while (!HasModelLoaded(modelHash)) {
		if (timeout < GetGameTimer()) {
			SetModelAsNoLongerNeeded(modelHash);
			return console.log("Model didn't load");
		}
		await Delay(0);
	}

	SetModelAsNoLongerNeeded(modelHash);
};

const pushEntToPlyMap = (serverId, ent) => {
	plyEntMap.set(serverId, ent);
};

const handleRadioProp = async (ply, serverId) => {
	const model = GetHashKey("prop_cs_hand_radio");

	const ped = GetPlayerPed(ply);

	const [x, y, z] = GetEntityCoords(ped, false);
	const [ox, oy, oz] = [0.0, 0.0, 0.0];
	const [rx, ry, rz] = [0.0, 0.0, 0.0];

	await loadModel(model);

	// create a object thats not networked
	const ent = CreateObject(model, x, y, z, false, false, false);

	// remove collisions we don't need them
	SetEntityCollision(ent, false, false);
	// we'll use this to cleanup on if we restart the resource
	Entity(ent).state.resource = GetCurrentResourceName();
	// We'll need to delete this later
	pushEntToPlyMap(serverId, ent);

	AttachEntityToEntity(ent, ped, GetPedBoneIndex(ped, 28422), ox, oy, oz, rx, ry, rz, true, false, false, true, 2, true);
};


const plyEntMap = new Map();

// copy pasta from pma-progbar & made less generic
AddStateBagChangeHandler("showRadioProp", null, async (bagName, _key, value, _slotId, willReplicate) => {
	// Don't do anything if we're sending replication
	if (willReplicate) return;

	const ply = GetPlayerFromStateBagName(bagName);
	// Not a player
	if (ply === 0) return;
	const serverId = GetPlayerServerId(ply);

	// Check if we already have an entity for this person, if we do then delete it.
	const ent = plyEntMap.get(serverId);
	if (ent) {
		DeleteEntity(ent);
		plyEntMap.delete(serverId);
	}

	if (!value) return;

	handleRadioProp(ply, serverId);
});

