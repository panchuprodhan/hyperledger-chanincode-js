/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

// const assetTransfer = require("./lib/assetTransfer");
const studentRecord = require("./lib/studentRecord");

// module.exports.AssetTransfer = assetTransfer;
module.exports.StudentRecord = studentRecord;
module.exports.contracts = [studentRecord];
