import { prop, path, toString } from "ramda";

export const clubInfo = clubId =>  infoMap => {
    const info = prop(Number(clubId))(infoMap)

    return {
        name: prop("name")(info),
        assetId: path(["customKit","crestAssetId"])(info),
        customTeam: Boolean(Number(path(["customKit","isCustomTeam"])(info))),
        baseAsset: Boolean(Number(path(["customKit","useBaseAsset"])(info))),
        regionId: Number(prop("regionId")(info)),
    }
}