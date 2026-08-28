import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { cleanupAllBeneficiaries } from "../../admin/utils/cleanupBeneficiaries";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/cleanup-beneficiaries")({
  component: CleanupBeneficiaries,
});

function CleanupBeneficiaries() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleCleanup = async () => {
    const confirmed = window.confirm(
      "⚠️ WARNING: This will permanently delete ALL beneficiaries from ALL accounts.\n\n" +
      "This includes:\n" +
      "• All saved beneficiaries\n" +
      "• All pending beneficiary requests\n" +
      "• Beneficiaries in user subcollections\n\n" +
      "This action CANNOT be undone!\n\n" +
      "Are you absolutely sure you want to proceed?"
    );

    if (!confirmed) return;

    // Double confirmation
    const doubleConfirmed = window.confirm(
      "FINAL CONFIRMATION:\n\n" +
      "You are about to delete all beneficiaries from the entire system.\n\n" +
      "Click OK to proceed with deletion."
    );

    if (!doubleConfirmed) return;

    setLoading(true);
    setResults(null);

    try {
      const cleanupResults = await cleanupAllBeneficiaries();
      setResults(cleanupResults);
      
      const totalDeleted = 
        cleanupResults.topLevel + 
        cleanupResults.userSubcollections + 
        cleanupResults.requests;

      toast.success(
        `Successfully deleted ${totalDeleted} beneficiary records!`,
        { duration: 5000 }
      );
    } catch (error: any) {
      console.error("Cleanup error:", error);
      toast.error(`Cleanup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Cleanup All Beneficiaries
        </h1>
        <p className="text-gray-600">
          Remove all saved beneficiaries from all user accounts
        </p>
      </div>

      <Card className="p-6 mb-6 border-amber-200 bg-amber-50">
        <div className="flex gap-4">
          <AlertTriangle className="text-amber-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-amber-900 mb-2">
              ⚠️ Destructive Action Warning
            </h3>
            <p className="text-sm text-amber-800 mb-3">
              This operation will permanently delete:
            </p>
            <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc">
              <li>All beneficiaries in the top-level collection</li>
              <li>All beneficiaries in user-specific subcollections</li>
              <li>All pending beneficiary approval requests</li>
            </ul>
            <p className="text-sm text-amber-800 mt-3 font-semibold">
              This action cannot be undone. Users will need to re-add their beneficiaries.
            </p>
          </div>
        </div>
      </Card>

      {results && (
        <Card className="p-6 mb-6 border-green-200 bg-green-50">
          <div className="flex gap-4">
            <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="font-bold text-green-900 mb-3">
                ✅ Cleanup Completed Successfully
              </h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>
                  <strong>Top-level beneficiaries deleted:</strong> {results.topLevel}
                </p>
                <p>
                  <strong>User subcollection beneficiaries deleted:</strong>{" "}
                  {results.userSubcollections}
                </p>
                <p>
                  <strong>Pending requests deleted:</strong> {results.requests}
                </p>
                <p className="mt-3 font-semibold">
                  Total records deleted:{" "}
                  {results.topLevel + results.userSubcollections + results.requests}
                </p>
                {results.errors.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="font-semibold text-red-900 mb-2">
                      Errors encountered ({results.errors.length}):
                    </p>
                    <ul className="text-xs text-red-800 space-y-1">
                      {results.errors.slice(0, 10).map((err: string, i: number) => (
                        <li key={i}>{err}</li>
                      ))}
                      {results.errors.length > 10 && (
                        <li>... and {results.errors.length - 10} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <Button
          onClick={handleCleanup}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Cleaning up...
            </>
          ) : (
            <>
              <Trash2 size={18} />
              Delete All Beneficiaries
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500 text-center mt-3">
          You will be asked to confirm this action twice before it executes
        </p>
      </Card>

      <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">
          ℹ️ After Cleanup
        </h3>
        <p className="text-sm text-blue-800">
          After running this cleanup, new accounts will be created without any default
          beneficiaries. Users can manually add beneficiaries through the "Add Beneficiary"
          feature, which will require admin approval.
        </p>
      </Card>
    </div>
  );
}
