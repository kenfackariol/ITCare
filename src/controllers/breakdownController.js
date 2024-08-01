const breakdownService = require('../services/breakdownService');
const { catchAsync } = require('../utils/catchAsync');

exports.createBreakdown = catchAsync(async (req, res) => {
    const userId = req.user.id;  // Extract userId from req.user set by protect middleware
    const breakdown = await breakdownService.createBreakdown(req.body, userId);
    res.status(201).json(breakdown);
});

exports.getAllBreakdowns = catchAsync(async (req, res) => {
    const breakdowns = await breakdownService.getAllBreakdowns();
    res.status(200).json(breakdowns);
});

exports.getBreakdownById = catchAsync(async (req, res) => {
    const breakdown = await breakdownService.readBreakdown(req.params.id);
    res.status(200).json(breakdown);
});

exports.updateBreakdown = catchAsync(async (req, res) => {
  const breakdown = await breakdownService.updateBreakdown(req.params.id, req.body);
  res.status(200).json(breakdown);
});

exports.deleteBreakdown = catchAsync(async (req, res) => {
    await breakdownService.deleteBreakdown(req.params.id);
    res.status(204).end();
});

exports.getBreakdownsByDateRange = catchAsync(async (req, res) => {
    const breakdowns = await breakdownService.getBreakdownsByDateRange(req.params.startDate, req.params.endDate);
    res.status(200).json(breakdowns);
});

exports.getBreakdownsByRequester = catchAsync(async (req, res) => {
    const breakdowns = await breakdownService.getBreakdownsByRequester(req.params.requesterName);
    res.status(200).json(breakdowns);
});

exports.getBreakdownsByUser = catchAsync(async (req, res) => {
    const breakdowns = await breakdownService.getBreakdownsByUser(req.params.userId);
    res.status(200).json(breakdowns);
});
